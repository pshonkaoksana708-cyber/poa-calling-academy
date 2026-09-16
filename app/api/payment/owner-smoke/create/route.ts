import { NextResponse } from "next/server";
import { createPaymentOrder } from "@/lib/payment/orders";
import {
  isAuthorizedOwnerSmokeRequest,
  OWNER_SMOKE_AMOUNT,
  OWNER_SMOKE_MARKER,
  OWNER_SMOKE_OUT_SUM,
  OWNER_SMOKE_PACKAGE_SLUG,
  OWNER_SMOKE_PRICE_VERSION,
  OWNER_SMOKE_PROFESSION_SLUG,
} from "@/lib/payment/owner-smoke";
import {
  buildRobokassaPaymentUrl,
  createPaymentSignature,
  encodeRobokassaReceipt,
  getRobokassaConfig,
  resolvePaymentPackage,
} from "@/lib/payment/robokassa";
import { createPaymentStatusToken } from "@/lib/payment/status-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OwnerSmokeRequest = {
  email?: string;
  name?: string;
  phone?: string;
};

function response(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  if (!isAuthorizedOwnerSmokeRequest(request)) {
    return response({ error: "Not found." }, 404);
  }

  let payload: OwnerSmokeRequest;

  try {
    payload = (await request.json()) as OwnerSmokeRequest;
  } catch {
    return response({ error: "Некорректный запрос на оплату." }, 400);
  }

  const customerEmail = (payload.email ?? "").trim().toLowerCase();

  if (!customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
    return response({ error: "Укажите корректный email владельца." }, 400);
  }

  const resolvedPackage = resolvePaymentPackage({
    professionSlug: OWNER_SMOKE_PROFESSION_SLUG,
    packageSlug: OWNER_SMOKE_PACKAGE_SLUG,
  });

  if (!resolvedPackage) {
    return response({ error: "Стартовый пакет не найден." }, 500);
  }

  let robokassaConfig;

  try {
    robokassaConfig = getRobokassaConfig();
  } catch {
    return response({ error: "Платежная система пока не настроена." }, 500);
  }

  if (robokassaConfig.isTest) {
    return response(
      { error: "Owner smoke-test доступен только в боевом режиме Robokassa." },
      409,
    );
  }

  const paymentOrder = createPaymentOrder({
    professionSlug: resolvedPackage.profession.slug,
    packageSlug: resolvedPackage.purchasePackage.slug,
    professionTitle: resolvedPackage.profession.title,
    packageTitle: resolvedPackage.purchasePackage.title,
    amount: OWNER_SMOKE_AMOUNT,
    outSum: OWNER_SMOKE_OUT_SUM,
    priceVersion: OWNER_SMOKE_PRICE_VERSION,
    customerName: (payload.name ?? "").trim(),
    customerEmail,
    customerPhone: (payload.phone ?? "").trim(),
  });
  const shpParams = {
    Shp_created_at: paymentOrder.createdAt,
    Shp_email: customerEmail,
    Shp_owner_smoke: OWNER_SMOKE_MARKER,
    Shp_package: resolvedPackage.purchasePackage.slug,
    Shp_price_version: OWNER_SMOKE_PRICE_VERSION,
    Shp_profession: resolvedPackage.profession.slug,
  };
  const encodedReceipt = encodeRobokassaReceipt({
    items: [
      {
        name: "POA CALLING — проверка оплаты владельцем",
        quantity: 1,
        sum: OWNER_SMOKE_AMOUNT,
        payment_method: "full_payment",
        payment_object: "service",
        tax: "none",
      },
    ],
  });
  const signatureValue = createPaymentSignature(
    robokassaConfig.merchantLogin,
    paymentOrder.outSum,
    paymentOrder.invId,
    robokassaConfig.password1,
    shpParams,
    encodedReceipt,
  );
  const paymentUrl = buildRobokassaPaymentUrl({
    merchantLogin: robokassaConfig.merchantLogin,
    outSum: paymentOrder.outSum,
    invId: paymentOrder.invId,
    description: "POA CALLING: проверка оплаты владельцем",
    signatureValue,
    email: paymentOrder.customerEmail,
    isTest: false,
    shpParams,
    encodedReceipt,
  });

  return response({
    paymentUrl,
    invId: paymentOrder.invId,
    paymentStatusToken: createPaymentStatusToken(paymentOrder),
  });
}
