"use client";

import Script from "next/script";
import { useEffect } from "react";

const fallbackMetrikaId = "112143640";
const metrikaId =
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() || fallbackMetrikaId;

type YandexGoalParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    ym?: (
      counterId: number,
      method: "hit" | "init" | "reachGoal",
      target?: string | YandexGoalParams,
      params?: YandexGoalParams,
    ) => void;
  }
}

export function reachYandexGoal(goal: string, params?: YandexGoalParams) {
  if (typeof window === "undefined" || typeof window.ym !== "function") {
    return;
  }

  const counterId = Number(metrikaId);

  if (!Number.isFinite(counterId)) {
    return;
  }

  try {
    window.ym(counterId, "reachGoal", goal, params);
  } catch {
    // Analytics must never interrupt the purchase flow.
  }
}

export function YandexMetrikaGoal({
  goal,
  params,
}: {
  goal: string;
  params?: YandexGoalParams;
}) {
  useEffect(() => {
    reachYandexGoal(goal, params);
  }, [goal, params]);

  return null;
}

function YandexMetrikaEvents() {
  useEffect(() => {
    const sentAccessFormOpen = { current: false };
    const sentPaymentSuccess = { current: false };

    const sendAccessFormOpen = () => {
      if (sentAccessFormOpen.current) {
        return;
      }

      sentAccessFormOpen.current = true;
      reachYandexGoal("access_form_open");
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");

      if (!link) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      const profession = url.searchParams.get("profession");
      const packageSlug = url.searchParams.get("package");

      if (profession && packageSlug && url.hash === "#access-form") {
        reachYandexGoal("package_select", {
          package: packageSlug,
          profession,
        });
      }

      if (url.hash === "#access-form") {
        sendAccessFormOpen();
      }
    };

    const sendPaymentSuccess = () => {
      if (
        sentPaymentSuccess.current ||
        window.location.pathname !== "/payment/success"
      ) {
        return;
      }

      sentPaymentSuccess.current = true;
      reachYandexGoal("payment_success");
    };

    const handleHashChange = () => {
      if (window.location.hash === "#access-form") {
        sendAccessFormOpen();
      }
    };

    const form = document.getElementById("access-form");
    const observer =
      form && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                sendAccessFormOpen();
              }
            },
            { threshold: 0.35 },
          )
        : null;

    if (form && observer) {
      observer.observe(form);
    } else if (window.location.hash === "#access-form") {
      sendAccessFormOpen();
    }

    document.addEventListener("click", handleClick);
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    sendPaymentSuccess();

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("hashchange", handleHashChange);
      observer?.disconnect();
    };
  }, []);

  return null;
}

export function YandexMetrika() {
  if (!metrikaId) {
    return null;
  }

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(${metrikaId}, 'init', {
              webvisor: true,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              ecommerce: 'dataLayer'
            });
          `,
        }}
      />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={`https://mc.yandex.ru/watch/${metrikaId}`}
            style={{ left: "-9999px", position: "absolute" }}
          />
        </div>
      </noscript>
      <YandexMetrikaEvents />
    </>
  );
}
