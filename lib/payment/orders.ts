export type PaymentOrderStatus = "created" | "paid";

export type PaymentOrder = {
  invId: number;
  professionSlug: string;
  packageSlug: string;
  professionTitle: string;
  packageTitle: string;
  amount: number;
  outSum: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: PaymentOrderStatus;
  createdAt: string;
  paidAt?: string;
};

type PaymentStore = {
  orders: Map<number, PaymentOrder>;
  processedPayments: Set<number>;
};

const globalPaymentStore = globalThis as typeof globalThis & {
  __poaPaymentStore?: PaymentStore;
};

function getPaymentStore() {
  if (!globalPaymentStore.__poaPaymentStore) {
    globalPaymentStore.__poaPaymentStore = {
      orders: new Map<number, PaymentOrder>(),
      processedPayments: new Set<number>(),
    };
  }

  return globalPaymentStore.__poaPaymentStore;
}

function createInvId() {
  const timestampPart = Math.floor(Date.now() / 1000) * 1000;
  const randomPart = Math.floor(Math.random() * 1000);

  return timestampPart + randomPart;
}

export function createPaymentOrder(
  order: Omit<PaymentOrder, "invId" | "status" | "createdAt">,
) {
  const store = getPaymentStore();
  let invId = createInvId();

  while (store.orders.has(invId)) {
    invId = createInvId();
  }

  const paymentOrder: PaymentOrder = {
    ...order,
    invId,
    status: "created",
    createdAt: new Date().toISOString(),
  };

  store.orders.set(invId, paymentOrder);

  return paymentOrder;
}

export function getPaymentOrder(invId: number) {
  return getPaymentStore().orders.get(invId) ?? null;
}

export function markPaymentPaid(invId: number) {
  const store = getPaymentStore();
  const order = store.orders.get(invId);

  if (!order) {
    return null;
  }

  if (store.processedPayments.has(invId) || order.status === "paid") {
    return order;
  }

  const paidOrder: PaymentOrder = {
    ...order,
    status: "paid",
    paidAt: new Date().toISOString(),
  };

  store.orders.set(invId, paidOrder);
  store.processedPayments.add(invId);

  return paidOrder;
}

export function isPaymentProcessed(invId: number) {
  return getPaymentStore().processedPayments.has(invId);
}

export function markPaymentProcessed(invId: number) {
  getPaymentStore().processedPayments.add(invId);
}
