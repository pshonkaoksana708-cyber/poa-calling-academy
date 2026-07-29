import type { AccessTokenPayload } from "@/lib/course-access";

export type SupplyBasicAccessPlan = "basic" | "practice" | "professional";

export const supplyBlock1AccessKeys = [
  "supply/basic",
  "supply/practice",
  "supply/pro",
  "supply/package/basic",
  "supply/package/pro",
  "supply/package/full",
];

export const supplyBlock2AccessKeys = [
  "supply/practice",
  "supply/pro",
  "supply/package/pro",
  "supply/package/full",
];

export const supplyBlock3AccessKeys = ["supply/pro", "supply/package/full"];

export function getSupplyBasicAccessPlan(
  payload?: AccessTokenPayload,
): SupplyBasicAccessPlan {
  switch (payload?.programSlug) {
    case "supply/basic":
    case "supply/package/basic":
      return "basic";
    case "supply/practice":
    case "supply/package/pro":
      return "practice";
    case "supply/pro":
    case "supply/package/full":
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
