import type { Metadata } from "next";
import {
  absoluteUrl,
  defaultOpenGraphAlt,
  defaultOpenGraphImage,
  siteUrl,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
  metadataBase: new URL(siteUrl),
  title: {
    default: "POA CALLING — Академия профессионального развития",
    template: "%s | POA CALLING",
  },
  description:
    "POA CALLING — Академия профессионального развития. Практические образовательные программы для получения новой профессии и развития профессиональных навыков.",
  openGraph: {
    title: "POA CALLING — Академия профессионального развития",
    description:
      "Практические образовательные программы для получения новой профессии и развития профессиональных навыков.",
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
    images: [defaultOpenGraphImage],
  },
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
