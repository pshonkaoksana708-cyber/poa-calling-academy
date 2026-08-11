import { NextResponse } from "next/server";
import { createPaymentOrder } from "@/lib/payment/orders";
import {
  buildRobokassaPaymentUrl,
  createPaymentSignature,
  getRobokassaConfig,
  parsePaymentSelection,
  resolvePaymentPackage,
} from "@/lib/payment/robokassa";

export const runtime = "nodejs";

type PaymentCreateRequest = {
  package?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export async function POST(request: Request) {
  let payload: PaymentCreateRequest;

  try {
    payload = (await request.json()) as PaymentCreateRequest;
  } catch {
    return NextResponse.json(
      { error: "Некорректный запрос на оплату." },
      { status: 400 },
    );
  }

  const selection = parsePaymentSelection(payload.package ?? "");

  if (!selection) {
    return NextResponse.json(
      { error: "Не выбран пакет образовательной программы." },
      { status: 400 },
    );
  }

  const resolvedPackage = resolvePaymentPackage(selection);

  if (!resolvedPackage) {
    return NextResponse.json(
      { error: "Пакет образовательной программы не найден." },
      { status: 404 },
    );
  }

  const customerEmail = (payload.email ?? "").trim();

  if (!customerEmail) {
    return NextResponse.json(
      { error: "Укажите email для получения доступа." },
      { status: 400 },
    );
  }

  let robokassaConfig;

  try {
    robokassaConfig = getRobokassaConfig();
  } catch {
    return NextResponse.json(
      { error: "Платежная система пока не настроена." },
      { status: 500 },
    );
  }

  const paymentOrder = createPaymentOrder({
    professionSlug: resolvedPackage.profession.slug,
    packageSlug: resolvedPackage.purchasePackage.slug,
    professionTitle: resolvedPackage.profession.title,
    packageTitle: resolvedPackage.purchasePackage.title,
    amount: resolvedPackage.amount,
    outSum: resolvedPackage.outSum,
    customerName: (payload.name ?? "").trim(),
    customerEmail,
    customerPhone: (payload.phone ?? "").trim(),
  });
  const shpParams = {
    Shp_package: resolvedPackage.purchasePackage.slug,
    Shp_profession: resolvedPackage.profession.slug,
  };
  const signatureValue = createPaymentSignature(
    robokassaConfig.merchantLogin,
    paymentOrder.outSum,
    paymentOrder.invId,
    robokassaConfig.password1,
    shpParams,
  );
  const paymentUrl = buildRobokassaPaymentUrl({
    merchantLogin: robokassaConfig.merchantLogin,
    outSum: paymentOrder.outSum,
    invId: paymentOrder.invId,
    description: `POA CALLING: ${paymentOrder.professionTitle}, ${paymentOrder.packageTitle}`,
    signatureValue,
    email: paymentOrder.customerEmail,
    isTest: robokassaConfig.isTest,
    shpParams,
  });

  return NextResponse.json({
    paymentUrl,
    invId: paymentOrder.invId,
  });
}
