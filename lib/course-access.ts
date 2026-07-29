import { createHmac, randomUUID, timingSafeEqual } from "crypto";

export type UserPurchase = {
  id: string;
  email: string;
  programSlug: string;
  status: "pending" | "paid" | "refunded" | "expired";
  paidAt?: string;
  createdAt: string;
};

export type CourseAccess = {
  id: string;
  email: string;
  programSlug: string;
  purchaseId: string;
  grantedAt: string;
  expiresAt: string;
};

export type AccessTokenPayload = {
  type: "course_access";
  tokenId: string;
  email: string;
  programSlug: string;
  purchaseId: string;
  issuedAt: number;
  expiresAt: number;
};

export type AccessValidationResult =
  | {
      ok: true;
      payload: AccessTokenPayload;
    }
  | {
      ok: false;
      reason: "missing" | "malformed" | "invalid_signature" | "expired" | "wrong_program";
    };

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 14;

function getAccessSecret() {
  return (
    process.env.ACCESS_TOKEN_SECRET ||
    "development-only-change-this-access-token-secret"
  );
}

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function fromBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return Buffer.from(padded, "base64").toString("utf8");
}

function sign(payload: string) {
  return toBase64Url(
    createHmac("sha256", getAccessSecret()).update(payload).digest(),
  );
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAccessToken(input: {
  email: string;
  programSlug: string;
  purchaseId: string;
  ttlSeconds?: number;
}) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: AccessTokenPayload = {
    type: "course_access",
    tokenId: randomUUID(),
    email: input.email.trim().toLowerCase(),
    programSlug: input.programSlug,
    purchaseId: input.purchaseId,
    issuedAt,
    expiresAt: issuedAt + (input.ttlSeconds ?? TOKEN_TTL_SECONDS),
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function validateAccessToken(
  token: string | undefined,
  programSlug: string,
): AccessValidationResult {
  if (!token) {
    return { ok: false, reason: "missing" };
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return { ok: false, reason: "malformed" };
  }

  const expectedSignature = sign(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return { ok: false, reason: "invalid_signature" };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as AccessTokenPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.type !== "course_access") {
      return { ok: false, reason: "malformed" };
    }

    if (payload.programSlug !== programSlug) {
      return { ok: false, reason: "wrong_program" };
    }

    if (payload.expiresAt < now) {
      return { ok: false, reason: "expired" };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}

export function validateAccessTokenForPrograms(
  token: string | undefined,
  allowedProgramSlugs: string[],
): AccessValidationResult {
  if (!token) {
    return { ok: false, reason: "missing" };
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return { ok: false, reason: "malformed" };
  }

  const expectedSignature = sign(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return { ok: false, reason: "invalid_signature" };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as AccessTokenPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.type !== "course_access") {
      return { ok: false, reason: "malformed" };
    }

    if (!allowedProgramSlugs.includes(payload.programSlug)) {
      return { ok: false, reason: "wrong_program" };
    }

    if (payload.expiresAt < now) {
      return { ok: false, reason: "expired" };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}

export function buildCourseAccessLink(input: {
  origin: string;
  programSlug: string;
  token: string;
}) {
  return `${input.origin}/course/${input.programSlug}?token=${encodeURIComponent(
    input.token,
  )}`;
}
