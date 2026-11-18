import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/ui";
import { businessLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const onest = Onest({ subsets: ["latin", "cyrillic"], variable: "--font-onest", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-unbounded", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Ремонт холодильников в Минске на дому", template: `%s — ${site.name}` },
  description: "Ремонт холодильников в Минске на дому. Выезд мастера за 1–2 часа, диагностика 0 BYN при ремонте, гарантия до 24 месяцев.",
  applicationName: site.name,
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#060a12", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${onest.variable} ${unbounded.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ice focus:px-5 focus:py-3 focus:text-ink">
          Перейти к содержимому
        </a>
        <Header />
        {children}
        <Footer />
        <JsonLd data={businessLd()} />
      </body>
    </html>
  );
}
