import type { MetadataRoute } from "next";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      allow: [
        "/",
        "/profession/",
        "/course/*/basic$",
        "/privacy",
        "/personal-data-consent",
        "/offer",
        "/terms",
        "/verify",
      ],
      disallow: [
        "/course/*/basic/lesson-*",
        "/course/*/basic/block-*/lesson-*",
        "/course/*/basic/*-test",
        "/course/*/basic/*/test",
        "/course/*/basic/final-project",
        "/course/*/basic/final-exam",
        "/course/*/basic/assessment",
        "/course/*/basic/completed",
        "/payment/",
      ],
      userAgent: "*",
    },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
