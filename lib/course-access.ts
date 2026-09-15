import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "crypto";

export type AccessTokenPayload = {
  type: "course_access";
  version: 2;
  tokenId: string;
  emailHash: string;
  programSlug: string;
  purchaseId: string;
  paidAt: number;
  issuedAt: number;
  expiresAt: number;
};

type LegacyAccessTokenPayload = Omit<
  AccessTokenPayload,
  "emailHash" | "paidAt" | "version"
> & {
  email: string;
  paidAt?: number;
  version?: undefined;
};

export type ValidAccessTokenPayload =
  | AccessTokenPayload
  | LegacyAccessTokenPayload;

export type AccessValidationResult =
  | { ok: true; payload: ValidAccessTokenPayload }
  | {
      ok: false;
      reason:
        | "missing"
        | "malformed"
        | "invalid_signature"
        | "expired"
        | "wrong_program"
        | "not_yet_available";
      unlockAt?: number;
    };

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 90;
const BLOCK_UNLOCK_DAYS = [0, 7, 14] as const;

function getAccessSecret() {
  const configuredSecret = process.env.ACCESS_TOKEN_SECRET?.trim();

  if (configuredSecret && (process.env.NODE_ENV !== "production" || configuredSecret.length >= 32)) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ACCESS_TOKEN_SECRET with at least 32 characters is required in production",
    );
  }

  return "development-only-access-token-secret";
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

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function isValidPayload(value: unknown): value is ValidAccessTokenPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<ValidAccessTokenPayload>;

  return (
    payload.type === "course_access" &&
    typeof payload.tokenId === "string" &&
    typeof payload.programSlug === "string" &&
    typeof payload.purchaseId === "string" &&
    typeof payload.issuedAt === "number" &&
    typeof payload.expiresAt === "number" &&
    (payload.version === 2
      ? typeof (payload as Partial<AccessTokenPayload>).emailHash === "string" &&
        typeof (payload as Partial<AccessTokenPayload>).paidAt === "number"
      : payload.version === undefined &&
        typeof (payload as Partial<LegacyAccessTokenPayload>).email === "string")
  );
}

function readAndVerifyToken(token: string | undefined): AccessValidationResult {
  if (!token) {
    return { ok: false, reason: "missing" };
  }

  const parts = token.split(".");

  if (parts.length !== 2) {
    return { ok: false, reason: "malformed" };
  }

  const [encodedPayload, signature] = parts;

  if (!encodedPayload || !signature) {
    return { ok: false, reason: "malformed" };
  }

  const expectedSignature = sign(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return { ok: false, reason: "invalid_signature" };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as unknown;

    if (!isValidPayload(payload)) {
      return { ok: false, reason: "malformed" };
    }

    if (payload.expiresAt < Math.floor(Date.now() / 1000)) {
      return { ok: false, reason: "expired" };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}

export function createAccessToken(input: {
  email: string;
  paidAt: string;
  programSlug: string;
  purchaseId: string;
  tokenId?: string;
  ttlSeconds?: number;
}) {
  const paidAt = Math.floor(new Date(input.paidAt).getTime() / 1000);

  if (!Number.isFinite(paidAt)) {
    throw new Error("A valid confirmed payment date is required");
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  const payload: AccessTokenPayload = {
    type: "course_access",
    version: 2,
    tokenId: input.tokenId ?? randomUUID(),
    emailHash: createHash("sha256").update(normalizedEmail).digest("hex"),
    programSlug: input.programSlug,
    purchaseId: input.purchaseId,
    paidAt,
    issuedAt: paidAt,
    expiresAt: paidAt + (input.ttlSeconds ?? DEFAULT_TOKEN_TTL_SECONDS),
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function getPaymentTimestamp(payload: ValidAccessTokenPayload) {
  return payload.paidAt ?? payload.issuedAt;
}

export function getBlockUnlockAt(
  payload: ValidAccessTokenPayload,
  blockNumber: 1 | 2 | 3,
) {
  return getPaymentTimestamp(payload) + BLOCK_UNLOCK_DAYS[blockNumber - 1] * 86400;
}

export function getEntitledBlockCount(payload?: ValidAccessTokenPayload) {
  const suffix = payload?.programSlug.split("/").at(-1);

  if (suffix === "basic") {
    return 1;
  }

  if (
    suffix === "practice" ||
    (suffix === "pro" && payload?.programSlug.includes("/package/"))
  ) {
    return 2;
  }

  return 3;
}

export function getAccessibleBlockCount(
  payload?: ValidAccessTokenPayload,
  now = Math.floor(Date.now() / 1000),
) {
  if (!payload) {
    return 0;
  }

  const entitledBlockCount = getEntitledBlockCount(payload);
  let availableBlockCount = 0;

  for (const blockNumber of [1, 2, 3] as const) {
    if (
      blockNumber <= entitledBlockCount &&
      now >= getBlockUnlockAt(payload, blockNumber)
    ) {
      availableBlockCount = blockNumber;
    }
  }

  return availableBlockCount;
}

export function validateAccessToken(
  token: string | undefined,
  programSlug: string,
): AccessValidationResult {
  return validateAccessTokenForPrograms(token, [programSlug]);
}

export function validateAccessTokenForPrograms(
  token: string | undefined,
  allowedProgramSlugs: string[],
  options?: { requiredBlock?: 1 | 2 | 3 },
): AccessValidationResult {
  const validation = readAndVerifyToken(token);

  if (!validation.ok) {
    return validation;
  }

  if (!allowedProgramSlugs.includes(validation.payload.programSlug)) {
    return { ok: false, reason: "wrong_program" };
  }

  if (options?.requiredBlock) {
    const unlockAt = getBlockUnlockAt(validation.payload, options.requiredBlock);

    if (Math.floor(Date.now() / 1000) < unlockAt) {
      return { ok: false, reason: "not_yet_available", unlockAt };
    }
  }

  return validation;
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
