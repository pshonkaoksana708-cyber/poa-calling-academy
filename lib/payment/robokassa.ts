import crypto from "node:crypto";
import { getProfession } from "@/data/professions";
import type { Profession, PurchasePackage } from "@/data/professions/types";

export const ROBOKASSA_PAYMENT_URL =
  "https://auth.robokassa.ru/Merchant/Index.aspx";

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

export function getRobokassaConfig(): RobokassaConfig {
  const readEnv = (key: string) => process.env[key]?.trim() ?? "";
  const isTest = ["1", "true", "yes"].includes(
    readEnv("ROBOKASSA_IS_TEST").toLowerCase(),
  );
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

  const receiptPart = params.encodedReceipt
    ? `&Receipt=${params.encodedReceipt}`
    : "";

  return `${ROBOKASSA_PAYMENT_URL}?${searchParams.toString()}${receiptPart}`;
}

export function encodeRobokassaReceipt(receipt: RobokassaReceipt) {
  return encodeURIComponent(JSON.stringify(receipt));
}
