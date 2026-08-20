import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import TranslateWidget from "@/components/TranslateWidget";
import TranslationDisclaimer from "@/components/TranslationDisclaimer";
import LanguageMenu from "@/components/LanguageMenu";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://leadforearth.org"),
  title: "LEADForEarth",
  description:
    "A district-wide environmental campaign uniting Lasallian schools across East Asia. Each campus chooses its own action, and all of us post under one hashtag: #LEADforEarth.",
  openGraph: {
    title: "LEADForEarth: One District, One Mission for the Earth",
    description:
      "A district-wide environmental campaign uniting Lasallian schools across East Asia. Each campus chooses its own action, and all of us post under one hashtag: #LEADforEarth.",
    siteName: "LEADForEarth",
    images: [
      {
        url: "/LEADForEarthBanner.png",
        width: 1200,
        height: 630,
        alt: "LEADForEarth: One District, One Mission for the Earth",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LEADForEarth: One District, One Mission for the Earth",
    description:
      "A district-wide environmental campaign uniting Lasallian schools across East Asia. Each campus chooses its own action, and all of us post under one hashtag: #LEADforEarth.",
    images: ["/LEADForEarthBanner.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If the visitor has a non-English translation cookie, mark <html> so
  // globals.css can keep the page hidden until Google Translate has actually
  // applied the translation. Prevents the "English fade-in, translated blink"
  // effect on reload after picking a language.
  const cookieStore = await cookies();
  const googtrans = cookieStore.get("googtrans")?.value ?? "";
  const needsTranslate = /^\/en\/(?!en$)[a-zA-Z-]+/.test(googtrans);
  const htmlClass = [
    "h-full antialiased",
    inter.variable,
    needsTranslate ? "lfe-needs-translate" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <head>
        {/* Warm the network to Google Translate before the user clicks a
            language. DNS prefetch + preconnect handle the handshake, and
            preload starts fetching the element script in parallel with our
            own JS so it's already cached by the time TranslateWidget mounts. */}
        <link rel="dns-prefetch" href="//translate.google.com" />
        <link rel="dns-prefetch" href="//translate.googleapis.com" />
        <link rel="dns-prefetch" href="//www.gstatic.com" />
        <link rel="preconnect" href="https://translate.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://translate.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="script"
          href="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <TranslateWidget />
        <LanguageMenu variant="floating" />
        <ThemeToggle />
        <TranslationDisclaimer />
        <Analytics />
      </body>
    </html>
  );
}
