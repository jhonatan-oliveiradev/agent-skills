"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAlternateLocale, localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { messages } from "@/lib/messages";

const localeStorageKey = "agent-skills-locale";

export function LocaleSwitcher({ locale }: Readonly<{ locale: Locale }>) {
  const pathname = usePathname();
  const alternateLocale = getAlternateLocale(locale);
  const localeMessages = messages[locale].locale;
  const alternateLanguage =
    alternateLocale === "en" ? localeMessages.en : localeMessages.ptBR;
  const accessibleLabel = localeMessages.switchTo.replace(
    "{language}",
    alternateLanguage,
  );

  function persistLocale() {
    try {
      window.localStorage.setItem(localeStorageKey, alternateLocale);
    } catch {
      // Navigation remains available when browser storage is blocked.
    }
  }

  return (
    <Link
      aria-label={accessibleLabel}
      className="locale-switcher"
      href={localizePath(pathname, alternateLocale) as Route}
      hrefLang={alternateLocale}
      lang={alternateLocale}
      onClick={persistLocale}
    >
      {alternateLocale === "en" ? "EN" : "PT-BR"}
    </Link>
  );
}
