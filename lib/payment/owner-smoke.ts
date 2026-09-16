import { timingSafeEqual } from "node:crypto";

export const OWNER_SMOKE_AMOUNT = 1;
export const OWNER_SMOKE_OUT_SUM = "1.00";
export const OWNER_SMOKE_PRICE_VERSION = "owner-smoke-1-rub-v1";
export const OWNER_SMOKE_PROFESSION_SLUG = "logistics";
export const OWNER_SMOKE_PACKAGE_SLUG = "basic";
export const OWNER_SMOKE_MARKER = "1";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function isAuthorizedOwnerSmokeRequest(request: Request) {
  const configuredSecret = process.env.OWNER_PAYMENT_SMOKE_SECRET?.trim() ?? "";
  const authorization = request.headers.get("authorization") ?? "";
  const prefix = "Bearer ";

  if (configuredSecret.length < 32 || !authorization.startsWith(prefix)) {
    return false;
  }

  return safeEqual(authorization.slice(prefix.length), configuredSecret);
}

export function isOwnerSmokePayment(input: {
  amount: number;
  outSum: string;
  packageSlug: string;
  priceVersion?: string;
  professionSlug: string;
}) {
  return (
    input.amount === OWNER_SMOKE_AMOUNT &&
    input.outSum === OWNER_SMOKE_OUT_SUM &&
    input.priceVersion === OWNER_SMOKE_PRICE_VERSION &&
    input.professionSlug === OWNER_SMOKE_PROFESSION_SLUG &&
    input.packageSlug === OWNER_SMOKE_PACKAGE_SLUG
  );
}
