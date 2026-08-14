import type { MetadataRoute } from "next";
import { professions } from "@/data/professions";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const publicRoutes = [
    "",
    "/privacy",
    "/personal-data-consent",
    "/offer",
    "/terms",
    "/verify",
    ...professions.flatMap((profession) => [
      `/profession/${profession.slug}`,
      `/course/${profession.slug}/basic`,
    ]),
  ];

  return publicRoutes.map((route) => ({
    changeFrequency: route === "" ? "weekly" : "monthly",
    lastModified: now,
    priority: route === "" ? 1 : route.startsWith("/profession") ? 0.8 : 0.6,
    url: absoluteUrl(route || "/"),
  }));
}
