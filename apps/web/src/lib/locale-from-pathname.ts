import type { Locale } from "./locales";

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/pt-BR" || pathname.startsWith("/pt-BR/") ? "pt-BR" : "en";
}
