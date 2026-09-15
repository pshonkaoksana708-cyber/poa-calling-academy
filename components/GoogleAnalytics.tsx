"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function GoogleAnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaMeasurementId || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("config", gaMeasurementId, {
      page_location: `${window.location.origin}${pathname}`,
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}

export function GoogleAnalytics() {
  if (!gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', { send_page_view: false });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView />
      </Suspense>
    </>
  );
}
