import type { AccessTokenPayload } from "@/lib/course-access";

export type LogisticsAccessPlan = "basic" | "practice" | "professional";

export const logisticsBlock1AccessKeys = [
  "logistics/basic",
  "logistics/practice",
  "logistics/pro",
  "logistics/package/basic",
  "logistics/package/pro",
  "logistics/package/full",
];

export const logisticsBlock2AccessKeys = [
  "logistics/practice",
  "logistics/pro",
  "logistics/package/pro",
  "logistics/package/full",
];

export const logisticsBlock3AccessKeys = ["logistics/pro", "logistics/package/full"];

export function getLogisticsAccessPlan(payload?: AccessTokenPayload): LogisticsAccessPlan {
  switch (payload?.programSlug) {
    case "logistics/basic":
    case "logistics/package/basic":
      return "basic";
    case "logistics/practice":
    case "logistics/package/pro":
      return "practice";
    case "logistics/pro":
    case "logistics/package/full":
    default:
      return "professional";
  }
}

export function appendToken(href: string, token?: string) {
  if (!token) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";

  return `${href}${separator}token=${encodeURIComponent(token)}`;
}
