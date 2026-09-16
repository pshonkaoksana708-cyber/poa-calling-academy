import { sendAccessEmailWithRetry } from "@/lib/payment/access-email";
import {
  isOwnerSmokePayment,
  OWNER_SMOKE_MARKER,
} from "@/lib/payment/owner-smoke";
import {
  createResultSignature,
  getRobokassaConfig,
  getRobokassaOperationState,
  isAcceptedRobokassaAmount,
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
  const ownerSmokePayment =
    params.Shp_owner_smoke === OWNER_SMOKE_MARKER &&
    isOwnerSmokePayment({
      amount: paidAmount,
      outSum,
      packageSlug: resolvedPackage.purchasePackage.slug,
      priceVersion: params.Shp_price_version,
      professionSlug: resolvedPackage.profession.slug,
    });

  if (
    !ownerSmokePayment &&
    !isAcceptedRobokassaAmount({
      currentAmount: resolvedPackage.amount,
      packageSlug: resolvedPackage.purchasePackage.slug,
      paidAmount,
      priceVersion: params.Shp_price_version,
      professionSlug: resolvedPackage.profession.slug,
    })
  ) {
    console.warn("[Robokassa] Missing required parameter: bad amount");
    return textResponse("bad amount", 400);
  }

  let paidAt: string | undefined = params.Shp_created_at;

  if (!config.isTest || process.env.ROBOKASSA_OP_STATE_URL?.trim()) {
    let operationState;

    try {
      operationState = await getRobokassaOperationState(config, numericInvId);
    } catch (error) {
      console.error(
        `[Robokassa] Status verification failed: ${
          error instanceof Error ? error.message : "unknown status error"
        }`,
      );
      return textResponse("temporary payment status failure", 503);
    }

    if (!operationState.confirmed) {
      return textResponse("payment is not confirmed", 409);
    }

    if (operationState.outSum !== paidAmount) {
      console.warn("[Robokassa] Operation status amount mismatch");
      return textResponse("bad operation amount", 400);
    }

    paidAt = operationState.stateDate;
  }

  if (!paidAt || !Number.isFinite(new Date(paidAt).getTime())) {
    const legacyTimestamp = Math.floor(numericInvId / 1000) * 1000;
    paidAt = Number.isFinite(new Date(legacyTimestamp).getTime())
      ? new Date(legacyTimestamp).toISOString()
      : new Date().toISOString();
  }

  try {
    const emailResult = await sendAccessEmailWithRetry({
      invId,
      email: customerEmail,
      paidAt,
      profession: resolvedPackage.profession,
      purchasePackage: resolvedPackage.purchasePackage,
    });

    if (!emailResult.sent) {
      console.error(`[Robokassa] Email sending failed: ${emailResult.reason}`);
      return textResponse("temporary email delivery failure", 503);
    }

    console.info("[Robokassa] Access email sent");
  } catch (error) {
    console.error(
      `[Robokassa] Email sending failed: ${
        error instanceof Error ? error.message : "unknown provider error"
      }`,
    );
    return textResponse("temporary email delivery failure", 503);
  }

  return textResponse(`OK${invId}`);
}
