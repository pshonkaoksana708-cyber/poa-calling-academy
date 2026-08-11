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
    return textResponse("payment system is not configured", 500);
  }

  const params = await readRobokassaParams(request);
  const outSum = params.OutSum;
  const invId = params.InvId;
  const signatureValue = params.SignatureValue;
  const shpParams = Object.fromEntries(
    Object.entries(params).filter(([key]) => key.startsWith("Shp_")),
  );

  if (!outSum || !invId || !signatureValue) {
    return textResponse("missing required payment params", 400);
  }

  const expectedSignature = createResultSignature(
    outSum,
    invId,
    config.password2,
    shpParams,
  );

  if (!timingSafeSignatureEqual(signatureValue, expectedSignature)) {
    return textResponse("bad sign", 400);
  }

  const numericInvId = Number(invId);
  const order = Number.isFinite(numericInvId) ? getPaymentOrder(numericInvId) : null;
  const resolvedPackage = resolvePaymentPackage({
    professionSlug: params.Shp_profession ?? "",
    packageSlug: params.Shp_package ?? "",
  });

  if (!Number.isFinite(numericInvId) || !resolvedPackage) {
    return textResponse("payment order params are invalid", 400);
  }

  const paidAmount = Number(outSum);

  if (!Number.isFinite(paidAmount) || paidAmount !== resolvedPackage.amount) {
    return textResponse("bad amount", 400);
  }

  if (order && order.amount !== resolvedPackage.amount) {
    return textResponse("bad order amount", 400);
  }

  if (!isPaymentProcessed(numericInvId)) {
    if (order) {
      markPaymentPaid(numericInvId);
    } else {
      markPaymentProcessed(numericInvId);
    }
  }

  return textResponse(`OK${invId}`);
}
