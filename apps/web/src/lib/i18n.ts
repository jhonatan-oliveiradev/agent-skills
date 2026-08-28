import { locales, type Locale } from "./locales";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "pt-BR" : "en";
}

export function localizePath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && isLocale(segments[0])) {
    segments.shift();
  }

  return `/${[locale, ...segments].join("/")}`;
}
