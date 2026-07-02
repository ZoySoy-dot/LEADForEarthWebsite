import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LEADForEarth",
  description:
    "A district-wide environmental campaign uniting Lasallian schools across East Asia — each campus choosing its own action, all of us posting under one hashtag: #LEADforEarth.",
  openGraph: {
    title: "LEADForEarth — One District, One Mission for the Earth",
    description:
      "A district-wide environmental campaign uniting Lasallian schools across East Asia — each campus choosing its own action, all of us posting under one hashtag: #LEADforEarth.",
    siteName: "LEADForEarth",
    images: [
      {
        url: "/leadforearth-logo.png",
        width: 400,
        height: 400,
        alt: "LEADForEarth Logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "LEADForEarth — One District, One Mission for the Earth",
    description:
      "A district-wide environmental campaign uniting Lasallian schools across East Asia — each campus choosing its own action, all of us posting under one hashtag: #LEADforEarth.",
    images: ["/leadforearth-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
