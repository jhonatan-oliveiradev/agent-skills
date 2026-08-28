import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { isLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://skills.jhonatanoliveira.com",
  ),
  title: {
    default: "Agent Skills Studio",
    template: "%s | Agent Skills Studio",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt-BR" }];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <a className="skip-link" href="#main-content">
            {messages[locale].skipLink}
          </a>
          <SiteHeader locale={locale} />
          <main id="main-content">{children}</main>
          <SiteFooter locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
