import type { Route } from "next";
import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { messages } from "@/lib/messages";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export function SiteHeader({ locale }: Readonly<{ locale: Locale }>) {
  const copy = messages[locale];
  const links = [
    ["/skills", copy.navigation.skills],
    ["/packs", copy.navigation.packs],
    ["/roadmap", copy.navigation.roadmap],
    ["/about", copy.navigation.about],
  ] as const;

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="brand-link" href={`/${locale}` as Route}>
          <span aria-hidden="true" className="brand-mark">
            AS
          </span>
          <span>{copy.brandLabel}</span>
        </Link>
        <nav aria-label={copy.navigation.label} className="primary-navigation">
          <ul>
            {links.map(([path, label]) => (
              <li key={path}>
                <Link href={localizePath(path, locale) as Route}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-controls">
          <LocaleSwitcher locale={locale} />
          <ThemeSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
