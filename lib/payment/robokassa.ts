import crypto from "node:crypto";
import { getProfession } from "@/data/professions";
import type { Profession, PurchasePackage } from "@/data/professions/types";

export const ROBOKASSA_PAYMENT_URL =
  "https://auth.robokassa.ru/Merchant/Index.aspx";
const ROBOKASSA_OPERATION_STATE_URL =
  "https://auth.robokassa.ru/Merchant/WebService/Service.asmx/OpStateExt";
export const CURRENT_PAYMENT_PRICE_VERSION = "catalog-2026-09-14";

const legacyPaymentAmounts: Record<string, number> = {
  "logistics:basic": 14900,
  "logistics:pro": 24900,
  "logistics:full": 34900,
};

export type PaymentSelection = {
  professionSlug: string;
  packageSlug: string;
};

export type ResolvedPaymentPackage = {
  profession: Profession;
  purchasePackage: PurchasePackage;
  amount: number;
  outSum: string;
};

export type RobokassaConfig = {
  merchantLogin: string;
  password1: string;
  password2: string;
  isTest: boolean;
};

export type RobokassaReceiptItem = {
  name: string;
  quantity: number;
  sum: number;
  payment_method: "full_payment";
  payment_object: "service";
  tax: "none";
};

export type RobokassaReceipt = {
  items: RobokassaReceiptItem[];
};

export type RobokassaOperationState = {
  confirmed: boolean;
  outSum?: number;
  stateDate?: string;
};

export function parsePaymentSelection(value: string): PaymentSelection | null {
  const [professionSlug, packageSlug] = value.split(":");

  if (!professionSlug || !packageSlug) {
    return null;
  }

  return { professionSlug, packageSlug };
}

export function normalizePrice(price: string) {
  const normalized = price.replace(/\s/g, "").replace("₽", "");

  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  return Number(normalized);
}

export function formatOutSum(amount: number) {
  return amount.toFixed(2);
}

export function resolvePaymentPackage(
  selection: PaymentSelection,
): ResolvedPaymentPackage | null {
  const profession = getProfession(selection.professionSlug);
  const purchasePackage = profession?.packages.find(
    (item) => item.slug === selection.packageSlug,
  );

  if (!profession || !purchasePackage) {
    return null;
  }

  const amount = normalizePrice(purchasePackage.price);

  if (!amount) {
    return null;
  }

  return {
    profession,
    purchasePackage,
    amount,
    outSum: formatOutSum(amount),
  };
}

export function isAcceptedRobokassaAmount(input: {
  currentAmount: number;
  orderAmount?: number;
  orderPriceVersion?: string;
  packageSlug: string;
  paidAmount: number;
  priceVersion?: string;
  professionSlug: string;
}) {
  if (!Number.isFinite(input.paidAmount) || input.paidAmount <= 0) {
    return false;
  }

  if (input.orderAmount !== undefined) {
    const versionMatches = input.orderPriceVersion
      ? input.priceVersion === input.orderPriceVersion
      : !input.priceVersion;

    return versionMatches && input.paidAmount === input.orderAmount;
  }

  if (input.priceVersion) {
    return (
      input.priceVersion === CURRENT_PAYMENT_PRICE_VERSION &&
      input.paidAmount === input.currentAmount
    );
  }

  if (input.paidAmount === input.currentAmount) {
    return true;
  }

  return (
    legacyPaymentAmounts[`${input.professionSlug}:${input.packageSlug}`] ===
    input.paidAmount
  );
}

export function getRobokassaConfig(): RobokassaConfig {
  const readEnv = (key: string) => process.env[key]?.trim() ?? "";
  const mode = readEnv("ROBOKASSA_IS_TEST").toLowerCase();
  const testModeValues = ["1", "true", "yes"];
  const liveModeValues = ["0", "false", "no"];

  if (![...testModeValues, ...liveModeValues].includes(mode)) {
    throw new Error(
      "ROBOKASSA_IS_TEST must be configured explicitly as true or false",
    );
  }

  const isTest = testModeValues.includes(mode);
  const merchantLogin = readEnv("ROBOKASSA_MERCHANT_LOGIN");
  const password1 = isTest
    ? readEnv("ROBOKASSA_TEST_PASSWORD_1")
    : readEnv("ROBOKASSA_PASSWORD_1");
  const password2 = isTest
    ? readEnv("ROBOKASSA_TEST_PASSWORD_2")
    : readEnv("ROBOKASSA_PASSWORD_2");

  if (!merchantLogin || !password1 || !password2) {
    throw new Error("Robokassa environment variables are not configured");
  }

  return {
    merchantLogin,
    password1,
    password2,
    isTest,
  };
}

export function md5Signature(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}

export function createShpSignatureSuffix(
  params: Record<string, string | number>,
) {
  return Object.entries(params)
    .sort(([left], [right]) => {
      if (left < right) {
        return -1;
      }

      if (left > right) {
        return 1;
      }

      return 0;
    })
    .map(([key, value]) => `:${key}=${value}`)
    .join("");
}

export function createPaymentSignature(
  merchantLogin: string,
  outSum: string,
  invId: number,
  password1: string,
  shpParams: Record<string, string | number> = {},
  encodedReceipt?: string,
) {
  const receiptPart = encodedReceipt ? `:${encodedReceipt}` : "";

  return md5Signature(
    `${merchantLogin}:${outSum}:${invId}${receiptPart}:${password1}${createShpSignatureSuffix(
      shpParams,
    )}`,
  );
}

export function createResultSignature(
  outSum: string,
  invId: string,
  password2: string,
  shpParams: Record<string, string | number> = {},
) {
  return md5Signature(
    `${outSum}:${invId}:${password2}${createShpSignatureSuffix(shpParams)}`,
  );
}

export function timingSafeSignatureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left.toLowerCase(), "utf8");
  const rightBuffer = Buffer.from(right.toLowerCase(), "utf8");

  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function readXmlElement(xml: string, elementName: string) {
  const match = xml.match(
    new RegExp(`<${elementName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${elementName}>`, "i"),
  );

  return match?.[1]?.trim();
}

function operationStateEndpoint() {
  if (process.env.NODE_ENV !== "production") {
    const testEndpoint = process.env.ROBOKASSA_OP_STATE_URL?.trim();

    if (testEndpoint) {
      return testEndpoint;
    }
  }

  return ROBOKASSA_OPERATION_STATE_URL;
}

export async function getRobokassaOperationState(
  config: RobokassaConfig,
  invId: number,
): Promise<RobokassaOperationState> {
  const hasDevelopmentEndpoint =
    process.env.NODE_ENV !== "production" &&
    Boolean(process.env.ROBOKASSA_OP_STATE_URL?.trim());

  // Robokassa does not expose test operations through OpStateExt.
  if (config.isTest && !hasDevelopmentEndpoint) {
    return { confirmed: false };
  }

  const signature = md5Signature(
    `${config.merchantLogin}:${invId}:${config.password2}`,
  );
  const searchParams = new URLSearchParams({
    MerchantLogin: config.merchantLogin,
    InvoiceID: String(invId),
    Signature: signature,
  });
  const response = await fetch(
    `${operationStateEndpoint()}?${searchParams.toString()}`,
    {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Robokassa status responded with HTTP ${response.status}`);
  }

  const xml = await response.text();
  const resultXml = readXmlElement(xml, "Result");
  const stateXml = readXmlElement(xml, "State");
  const infoXml = readXmlElement(xml, "Info");
  const resultCode = Number(resultXml ? readXmlElement(resultXml, "Code") : NaN);
  const stateCode = Number(stateXml ? readXmlElement(stateXml, "Code") : NaN);
  const outSumText = infoXml ? readXmlElement(infoXml, "OutSum") : undefined;
  const outSum = outSumText === undefined ? undefined : Number(outSumText);
  const stateDate = stateXml ? readXmlElement(stateXml, "StateDate") : undefined;

  if (!Number.isFinite(resultCode) || resultCode !== 0) {
    return { confirmed: false };
  }

  return {
    confirmed: stateCode === 100,
    outSum: Number.isFinite(outSum) ? outSum : undefined,
    stateDate,
  };
}

export function buildRobokassaPaymentUrl(params: {
  merchantLogin: string;
  outSum: string;
  invId: number;
  description: string;
  signatureValue: string;
  email?: string;
  isTest: boolean;
  shpParams?: Record<string, string | number>;
  encodedReceipt?: string;
}) {
  const searchParams = new URLSearchParams({
    MerchantLogin: params.merchantLogin,
    OutSum: params.outSum,
    InvId: String(params.invId),
    Description: params.description.slice(0, 100),
    SignatureValue: params.signatureValue,
    Culture: "ru",
  });

  if (params.email) {
    searchParams.set("Email", params.email);
  }

  Object.entries(params.shpParams ?? {}).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  if (params.isTest) {
    searchParams.set("IsTest", "1");
  }

  if (params.encodedReceipt) {
    searchParams.set("Receipt", params.encodedReceipt);
  }

  const paymentUrl =
    process.env.NODE_ENV !== "production" &&
    process.env.ROBOKASSA_PAYMENT_URL_OVERRIDE?.trim()
      ? process.env.ROBOKASSA_PAYMENT_URL_OVERRIDE.trim()
      : ROBOKASSA_PAYMENT_URL;

  return `${paymentUrl}?${searchParams.toString()}`;
}

export function encodeRobokassaReceipt(receipt: RobokassaReceipt) {
  return encodeURIComponent(JSON.stringify(receipt));
}
