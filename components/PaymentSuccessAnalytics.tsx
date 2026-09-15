"use client";

import { useEffect } from "react";
import { reachYandexGoal } from "@/components/YandexMetrika";

const paymentApiOrigin = (
  process.env.NEXT_PUBLIC_PAYMENT_API_ORIGIN ?? "https://api.poacalling.com"
).replace(/\/$/, "");
const paymentStatusEndpoint = `${paymentApiOrigin}/api/payment/status`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function PaymentSuccessAnalytics({ invId }: { invId?: string }) {
  useEffect(() => {
    if (!invId || !/^\d+$/.test(invId)) {
      return;
    }

    const storageKey = `poa_payment_status_${invId}`;
    const eventKey = `poa_payment_success_sent_${invId}`;
    const statusToken = window.sessionStorage.getItem(storageKey);

    if (!statusToken || window.sessionStorage.getItem(eventKey) === "1") {
      return;
    }

    let cancelled = false;
    let attempt = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const checkPayment = async () => {
      attempt += 1;

      try {
        const response = await fetch(paymentStatusEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invId: Number(invId), statusToken }),
          cache: "no-store",
        });
        const result = (await response.json()) as { confirmed?: boolean };

        if (response.ok && result.confirmed && !cancelled) {
          window.sessionStorage.setItem(eventKey, "1");
          window.sessionStorage.removeItem(storageKey);
          reachYandexGoal("payment_success", { transaction_id: invId });
          window.gtag?.("event", "payment_success", {
            transaction_id: invId,
          });
          return;
        }
      } catch {
        // A temporary status API error is retried below.
      }

      if (!cancelled && attempt < 10) {
        timeoutId = setTimeout(checkPayment, 2000);
      }
    };

    void checkPayment();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [invId]);

  return null;
}
