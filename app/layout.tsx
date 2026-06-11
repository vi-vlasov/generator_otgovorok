import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Генератор отмазок",
  description:
    "Убедительные и креативные отмазки для любой ситуации — с рейтингом правдоподобности.",
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  openGraph: {
    title: "Генератор отмазок",
    description:
      "Убедительные и креативные отмазки для любой ситуации — с рейтингом правдоподобности.",
    url: "/",
    siteName: "Генератор отмазок",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Генератор отмазок — креативные отмазки с рейтингом правдоподобности",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Генератор отмазок",
    description:
      "Убедительные и креативные отмазки для любой ситуации — с рейтингом правдоподобности.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${rubik.variable} min-h-svh antialiased`}>
      <body className="flex min-h-svh flex-col bg-[#120a24] text-white">{children}</body>
    </html>
  );
}
