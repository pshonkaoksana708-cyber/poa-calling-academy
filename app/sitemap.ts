import type { MetadataRoute } from "next";
import { professions } from "@/data/professions";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const publicRoutes = [
    "",
    "/privacy",
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
    url: siteUrl ? `${siteUrl}${route}` : route || "/",
  }));
}
