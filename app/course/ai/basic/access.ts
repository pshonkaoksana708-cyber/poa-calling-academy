import type { AccessTokenPayload } from "@/lib/course-access";

export type AiAccessPlan = "basic" | "practice" | "professional";

export const aiBlock1AccessKeys = [
  "ai/basic",
  "ai/practice",
  "ai/pro",
  "ai/package/basic",
  "ai/package/pro",
  "ai/package/full",
];

export const aiBlock2AccessKeys = [
  "ai/practice",
  "ai/pro",
  "ai/package/pro",
  "ai/package/full",
];

export const aiBlock3AccessKeys = ["ai/pro", "ai/package/full"];

export function getAiAccessPlan(payload?: AccessTokenPayload): AiAccessPlan {
  switch (payload?.programSlug) {
    case "ai/basic":
    case "ai/package/basic":
      return "basic";
    case "ai/practice":
    case "ai/package/pro":
      return "practice";
    case "ai/pro":
    case "ai/package/full":
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
