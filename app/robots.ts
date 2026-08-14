import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
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
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
