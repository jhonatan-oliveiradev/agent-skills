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

interface LocaleRedirectProps {
  readonly location?: Pick<Location, "replace">;
}

export function LocaleRedirect({ location }: LocaleRedirectProps = {}) {
  useEffect(() => {
    const redirectLocation = location ?? window.location;
    redirectLocation.replace(getLocaleRedirectTarget(getPreferredLocale(), navigator.languages));
  }, [location]);

  return null;
}
