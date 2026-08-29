import type { Route } from "next";
import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { messages } from "@/lib/messages";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeTransitionToggle } from "./theme-switcher";
import { EditorialNavigation } from "./editorial-navigation";

export function SiteHeader({ locale }: Readonly<{ locale: Locale }>) {
  const copy = messages[locale];
  const links = [
    ["/skills", copy.navigation.skills],
    ["/packs", copy.navigation.packs],
    ["/getting-started", copy.navigation.gettingStarted],
    ["/built-with-skills", copy.navigation.builtWithSkills],
    ["/roadmap", copy.navigation.roadmap],
    ["/about", copy.navigation.about],
  ].map(([path, label]) => [localizePath(path, locale) as Route, label] as const);

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="brand-link" href={`/${locale}` as Route}>
          <span aria-hidden="true" className="brand-mark">
            AS
          </span>
          <span>{copy.brandLabel}</span>
        </Link>
        <EditorialNavigation closeLabel={copy.navigation.close} label={copy.navigation.label} links={links} openLabel={copy.navigation.open} />
        <div className="site-controls">
          <LocaleSwitcher locale={locale} />
          <ThemeTransitionToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
