import type { AccessTokenPayload } from "@/lib/course-access";

export type TourismAccessPlan = "basic" | "practice" | "professional";

export const tourismBlock1AccessKeys = [
  "tourism/basic",
  "tourism/practice",
  "tourism/pro",
  "tourism/package/basic",
  "tourism/package/pro",
  "tourism/package/full",
];

export const tourismBlock2AccessKeys = [
  "tourism/practice",
  "tourism/pro",
  "tourism/package/pro",
  "tourism/package/full",
];

export const tourismBlock3AccessKeys = ["tourism/pro", "tourism/package/full"];

export function getTourismAccessPlan(payload?: AccessTokenPayload): TourismAccessPlan {
  switch (payload?.programSlug) {
    case "tourism/basic":
    case "tourism/package/basic":
      return "basic";
    case "tourism/practice":
    case "tourism/package/pro":
      return "practice";
    case "tourism/pro":
    case "tourism/package/full":
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
