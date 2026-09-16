import { NextResponse } from "next/server";
import { sendAccessEmailWithRetry } from "@/lib/payment/access-email";
import { isOwnerSmokePayment } from "@/lib/payment/owner-smoke";
import {
  getRobokassaConfig,
  getRobokassaOperationState,
  resolvePaymentPackage,
} from "@/lib/payment/robokassa";
import { validatePaymentStatusToken } from "@/lib/payment/status-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StatusRequest = {
  invId?: number;
  statusToken?: string;
};

const allowedOrigins = new Set([
  "https://www.poacalling.com",
  "https://poacalling.com",
  "https://www.poacalling.ru",
  "https://poacalling.ru",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const headers = new Headers({
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    Vary: "Origin",
  });

  if (
    allowedOrigins.has(origin) ||
    /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  ) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  return headers;
}

function statusResponse(
  request: Request,
  body: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders(request),
  });
}

export function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  let payload: StatusRequest;

  try {
    payload = (await request.json()) as StatusRequest;
  } catch {
    return statusResponse(request, { confirmed: false }, 400);
  }

  const invId = Number(payload.invId);
  const statusToken = payload.statusToken?.trim() ?? "";

  if (!Number.isSafeInteger(invId) || !statusToken) {
    return statusResponse(request, { confirmed: false }, 403);
  }

  let tokenValidation;

  try {
    tokenValidation = validatePaymentStatusToken(invId, statusToken);
  } catch {
    return statusResponse(request, { confirmed: false }, 500);
  }

  if (!tokenValidation.ok) {
    return statusResponse(request, { confirmed: false }, 403);
  }

  const order = tokenValidation.payload;
  const resolvedPackage = resolvePaymentPackage({
    professionSlug: order.professionSlug,
    packageSlug: order.packageSlug,
  });
  const ownerSmokePayment = isOwnerSmokePayment({
    amount: order.amount,
    outSum: order.outSum,
    packageSlug: order.packageSlug,
    priceVersion: order.priceVersion,
    professionSlug: order.professionSlug,
  });

  if (
    !resolvedPackage ||
    (!ownerSmokePayment &&
      (resolvedPackage.amount !== order.amount ||
        resolvedPackage.outSum !== order.outSum))
  ) {
    return statusResponse(request, { confirmed: false }, 409);
  }

  let config;
  let operationState;

  try {
    config = getRobokassaConfig();
    operationState = await getRobokassaOperationState(config, invId);
  } catch (error) {
    console.error(
      `[Robokassa] Status check failed: ${
        error instanceof Error ? error.message : "unknown status error"
      }`,
    );
    return statusResponse(request, { confirmed: false }, 503);
  }

  if (
    !operationState.confirmed ||
    operationState.outSum !== order.amount ||
    !operationState.stateDate ||
    !Number.isFinite(new Date(operationState.stateDate).getTime())
  ) {
    return statusResponse(request, { confirmed: false });
  }

  const emailResult = await sendAccessEmailWithRetry({
    invId: String(invId),
    email: order.customerEmail,
    paidAt: operationState.stateDate,
    profession: resolvedPackage.profession,
    purchasePackage: resolvedPackage.purchasePackage,
  });

  if (!emailResult.sent) {
    console.error(`[Robokassa] Email sending failed: ${emailResult.reason}`);
    return statusResponse(request, { confirmed: true, emailSent: false }, 503);
  }

  return statusResponse(request, { confirmed: true, emailSent: true });
}
