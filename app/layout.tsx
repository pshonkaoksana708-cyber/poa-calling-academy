import type { Metadata } from "next";
import {
  absoluteUrl,
  defaultOpenGraphAlt,
  defaultOpenGraphImage,
  getSiteVerificationMetadata,
  homeSeo,
  siteUrl,
} from "@/lib/seo";
import "./globals.css";

const verification = getSiteVerificationMetadata();

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
  metadataBase: new URL(siteUrl),
  title: {
    default: homeSeo.title,
    template: "%s | POA CALLING",
  },
  description: homeSeo.description,
  openGraph: {
    title: homeSeo.title,
    description: homeSeo.description,
    images: [
      {
        alt: defaultOpenGraphAlt,
        url: defaultOpenGraphImage,
      },
    ],
    locale: "ru_RU",
    siteName: "POA CALLING",
    type: "website",
    url: absoluteUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    description: homeSeo.description,
    images: [defaultOpenGraphImage],
    title: homeSeo.title,
  },
  ...(verification ? { verification } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
