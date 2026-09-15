import { randomInt } from "node:crypto";

export type PaymentOrder = {
  invId: number;
  professionSlug: string;
  packageSlug: string;
  professionTitle: string;
  packageTitle: string;
  amount: number;
  outSum: string;
  priceVersion: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
};

function createInvId() {
  const timestampPart = Date.now() * 1000;
  return timestampPart + randomInt(0, 1000);
}

/**
 * Payment orders are intentionally self-contained. The signed status token and
 * Robokassa's signed Shp_* fields carry the order context between serverless
 * invocations, so correctness never depends on process memory.
 */
export function createPaymentOrder(
  order: Omit<PaymentOrder, "invId" | "createdAt">,
): PaymentOrder {
  return {
    ...order,
    invId: createInvId(),
    createdAt: new Date().toISOString(),
  };
}
