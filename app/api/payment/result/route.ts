import { sendAccessEmail } from "@/lib/payment/access-email";
import {
  getPaymentOrder,
  isPaymentProcessed,
  markPaymentPaid,
  markPaymentProcessed,
} from "@/lib/payment/orders";
import {
  createResultSignature,
  getRobokassaConfig,
  resolvePaymentPackage,
  timingSafeSignatureEqual,
} from "@/lib/payment/robokassa";

export const runtime = "nodejs";

async function readRobokassaParams(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await request.json()) as Record<string, string>;
    return payload;
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();

    return Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        typeof value === "string" ? value : value.name,
      ]),
    );
  }

  const body = await request.text();
  const searchParams = new URLSearchParams(body);

  return Object.fromEntries(searchParams.entries());
}

function textResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function POST(request: Request) {
  let config;

  try {
    config = getRobokassaConfig();
  } catch {
    console.error("[Robokassa] Missing required parameter: env configuration");
    return textResponse("payment system is not configured", 500);
  }

  const params = await readRobokassaParams(request);
  console.info("[Robokassa] Result callback received");
  const outSum = params.OutSum;
  const invId = params.InvId;
  const signatureValue = params.SignatureValue;
  const shpParams = Object.fromEntries(
    Object.entries(params).filter(([key]) => key.startsWith("Shp_")),
  );

  if (!outSum || !invId || !signatureValue) {
    console.warn("[Robokassa] Missing required parameter");
    return textResponse("missing required payment params", 400);
  }

  console.info(`[Robokassa] InvId: ${invId}`);
  console.info(`[Robokassa] IsTest: ${config.isTest ? "true" : "false"}`);

  const expectedSignature = createResultSignature(
    outSum,
    invId,
    config.password2,
    shpParams,
  );

  if (!timingSafeSignatureEqual(signatureValue, expectedSignature)) {
    console.warn("[Robokassa] Invalid signature");
    return textResponse("bad sign", 400);
  }

  console.info("[Robokassa] Signature valid");

  const numericInvId = Number(invId);
  const order = Number.isFinite(numericInvId) ? getPaymentOrder(numericInvId) : null;
  const resolvedPackage = resolvePaymentPackage({
    professionSlug: params.Shp_profession ?? "",
    packageSlug: params.Shp_package ?? "",
  });
  const customerEmail = params.Shp_email?.trim().toLowerCase() ?? "";

  if (!Number.isFinite(numericInvId) || !resolvedPackage || !customerEmail) {
    console.warn("[Robokassa] Missing required parameter");
    return textResponse("payment order params are invalid", 400);
  }

  const paidAmount = Number(outSum);

  if (!Number.isFinite(paidAmount) || paidAmount !== resolvedPackage.amount) {
    console.warn("[Robokassa] Missing required parameter: bad amount");
    return textResponse("bad amount", 400);
  }

  if (order && order.amount !== resolvedPackage.amount) {
    console.warn("[Robokassa] Missing required parameter: order amount mismatch");
    return textResponse("bad order amount", 400);
  }

  if (!isPaymentProcessed(numericInvId)) {
    if (order) {
      markPaymentPaid(numericInvId);
    } else {
      markPaymentProcessed(numericInvId);
    }

    const emailResult = await sendAccessEmail({
      invId,
      email: customerEmail,
      profession: resolvedPackage.profession,
      purchasePackage: resolvedPackage.purchasePackage,
    });

    if (emailResult.sent) {
      console.info("[Robokassa] Access email sent");
    } else {
      console.error(`[Robokassa] Email sending failed: ${emailResult.reason}`);
    }
  }

  return textResponse(`OK${invId}`);
}
