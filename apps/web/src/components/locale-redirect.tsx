"use client";

import { useEffect } from "react";
import { isLocale } from "@/lib/i18n";

const localeStorageKey = "agent-skills-locale";

function getPreferredLocale(): string | null {
  try {
    return window.localStorage.getItem(localeStorageKey);
  } catch {
    return null;
  }
}

function prefersPortuguese(languages: readonly string[]): boolean {
  return languages.some((language) => language.toLowerCase().startsWith("pt"));
}

export function getLocaleRedirectTarget(
  preferredLocale: string | null,
  languages: readonly string[],
): "/en" | "/pt-BR" {
  if (preferredLocale && isLocale(preferredLocale)) {
    return `/${preferredLocale}`;
  }

  return prefersPortuguese(languages) ? "/pt-BR" : "/en";
}

export function LocaleRedirect() {
  useEffect(() => {
    window.location.replace(getLocaleRedirectTarget(getPreferredLocale(), navigator.languages));
  }, []);

  return null;
}
