import type { AccessTokenPayload } from "@/lib/course-access";

export type HrAccessPlan = "basic" | "practice" | "professional";

export const hrBlock1AccessKeys = [
  "hr/basic",
  "hr/practice",
  "hr/pro",
  "hr/package/basic",
  "hr/package/pro",
  "hr/package/full",
];

export const hrBlock2AccessKeys = [
  "hr/practice",
  "hr/pro",
  "hr/package/pro",
  "hr/package/full",
];

export const hrBlock3AccessKeys = ["hr/pro", "hr/package/full"];

export function getHrAccessPlan(payload?: AccessTokenPayload): HrAccessPlan {
  switch (payload?.programSlug) {
    case "hr/basic":
    case "hr/package/basic":
      return "basic";
    case "hr/practice":
    case "hr/package/pro":
      return "practice";
    case "hr/pro":
    case "hr/package/full":
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
