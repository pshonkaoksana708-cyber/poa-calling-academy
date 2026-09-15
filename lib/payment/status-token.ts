import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentOrder } from "@/lib/payment/orders";

const PAYMENT_STATUS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export type PaymentStatusTokenPayload = {
  type: "payment_status";
  version: 1;
  invId: number;
  professionSlug: string;
  packageSlug: string;
  amount: number;
  outSum: string;
  priceVersion: string;
  customerEmail: string;
  createdAt: string;
  issuedAt: number;
  expiresAt: number;
};

type PaymentStatusValidation =
  | { ok: true; payload: PaymentStatusTokenPayload }
  | { ok: false };

function getSecret() {
  const secret = process.env.ACCESS_TOKEN_SECRET?.trim();

  if (secret && (process.env.NODE_ENV !== "production" || secret.length >= 32)) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ACCESS_TOKEN_SECRET with at least 32 characters is required in production",
    );
  }

  return "development-only-payment-status-secret";
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(encodedPayload: string) {
  return createHmac("sha256", getSecret())
    .update(`payment-status:${encodedPayload}`)
    .digest("base64url");
}

function safeEqual(left: string, right: string) {
  const expected = Buffer.from(left);
  const received = Buffer.from(right);

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

function isPayload(value: unknown): value is PaymentStatusTokenPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<PaymentStatusTokenPayload>;

  return (
    payload.type === "payment_status" &&
    payload.version === 1 &&
    Number.isSafeInteger(payload.invId) &&
    typeof payload.professionSlug === "string" &&
    typeof payload.packageSlug === "string" &&
    typeof payload.amount === "number" &&
    typeof payload.outSum === "string" &&
    typeof payload.priceVersion === "string" &&
    typeof payload.customerEmail === "string" &&
    typeof payload.createdAt === "string" &&
    typeof payload.issuedAt === "number" &&
    typeof payload.expiresAt === "number"
  );
}

export function createPaymentStatusToken(order: PaymentOrder) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: PaymentStatusTokenPayload = {
    type: "payment_status",
    version: 1,
    invId: order.invId,
    professionSlug: order.professionSlug,
    packageSlug: order.packageSlug,
    amount: order.amount,
    outSum: order.outSum,
    priceVersion: order.priceVersion,
    customerEmail: order.customerEmail.trim().toLowerCase(),
    createdAt: order.createdAt,
    issuedAt,
    expiresAt: issuedAt + PAYMENT_STATUS_TOKEN_TTL_SECONDS,
  };
  const encodedPayload = encode(JSON.stringify(payload));

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function validatePaymentStatusToken(
  invId: number,
  token: string,
): PaymentStatusValidation {
  const parts = token.split(".");

  if (parts.length !== 2) {
    return { ok: false };
  }

  const [encodedPayload, signature] = parts;

  if (!encodedPayload || !signature || !safeEqual(sign(encodedPayload), signature)) {
    return { ok: false };
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as unknown;

    if (
      !isPayload(payload) ||
      payload.invId !== invId ||
      payload.expiresAt < Math.floor(Date.now() / 1000)
    ) {
      return { ok: false };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false };
  }
}
