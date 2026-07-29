import type { Metadata } from "next";
import "@/styles/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
const openGraphImage = "/images/hero/academy-og.jpg";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
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
    ...(siteUrl
      ? {
          images: [
            {
              alt: "POA CALLING — Академия профессионального развития",
              url: openGraphImage,
            },
          ],
        }
      : {}),
    locale: "ru_RU",
    siteName: "POA CALLING",
    type: "website",
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
