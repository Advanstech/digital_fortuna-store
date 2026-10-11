import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LenisProvider } from "@/components/lenis-provider";
import { CurrencyProvider } from "@/lib/currency";
import { SiteHeader } from "@/components/ui/site-header";
import { SiteFooter } from "@/components/ui/site-footer";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Fortuna Computing - Acquire. Launch. Dominate.",
  description: "The world's most curated on-demand marketplace for production-ready startup software, AI-powered tools, and full-stack digital businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-[#0A0F1E] text-white"
        suppressHydrationWarning
      >
        <LenisProvider>
          <ToastProvider>
            <CurrencyProvider>
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </CurrencyProvider>
          </ToastProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
