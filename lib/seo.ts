import type { Metadata } from "next";

export const siteUrl = "https://www.poacalling.com";
export const defaultOpenGraphImage = "/images/hero/academy-og.jpg";
export const defaultOpenGraphAlt =
  "POA CALLING — Академия профессионального развития";

export const noIndexRobots = {
  follow: false,
  googleBot: {
    follow: false,
    index: false,
  },
  index: false,
} satisfies Metadata["robots"];

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}

export function publicSeo(path: string): Metadata {
  return {
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      images: [
        {
          alt: defaultOpenGraphAlt,
          url: defaultOpenGraphImage,
        },
      ],
      url: absoluteUrl(path),
    },
    twitter: {
      card: "summary_large_image",
      images: [defaultOpenGraphImage],
    },
  };
}
