import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { messages } from "@/lib/messages";
import { siteChromeCopy, type SiteChromeContextKey } from "@/lib/site-chrome-copy";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeTransitionToggle } from "./theme-switcher";
import { EditorialNavigation } from "./editorial-navigation";

export function SiteHeader({ locale }: Readonly<{ locale: Locale }>) {
  const copy = messages[locale];
  const chrome = siteChromeCopy[locale].header;
  const catalog = getCatalog();
  const links = [
    ["/skills", copy.navigation.skills, "skills"],
    ["/packs", copy.navigation.packs, "packs"],
    ["/getting-started", copy.navigation.gettingStarted, "gettingStarted"],
    ["/built-with-skills", copy.navigation.builtWithSkills, "builtWithSkills"],
    ["/roadmap", copy.navigation.roadmap, "roadmap"],
    ["/about", copy.navigation.about, "about"],
  ].map(([path, label, contextKey]) => {
    const key = contextKey as SiteChromeContextKey;
    return {
      href: localizePath(path, locale) as Route,
      label,
      ...chrome.contexts[key],
    } as const;
  });

  return (
    <header className="site-header" data-site-chrome="publication-bar">
      <div className="shell site-header__inner">
        <div className="site-identity">
          <Link className="brand-link" href={`/${locale}` as Route}>
            <span aria-hidden="true" className="brand-lockup">
              <Image
                className="brand-logo"
                height={58}
                priority
                src="/brand/agent-skills-logo-horizontal.svg"
                width={149}
                alt=""
              />
            </span>
            <span className="sr-only">{copy.brandLabel}</span>
          </Link>
        </div>
        <div className="site-publication-context" aria-hidden="true">
          <span>{copy.navigation.descriptor}</span>
          <span>VOL. 01</span>
        </div>
        <div className="site-controls">
          <LocaleSwitcher locale={locale} />
          <ThemeTransitionToggle className="site-theme-toggle" locale={locale} />
        </div>
        <EditorialNavigation
          closeLabel={copy.navigation.close}
          collectionLabel={chrome.collectionLabel}
          cta={copy.navigation.cta}
          indexLabel={chrome.index}
          indexSummary={chrome.indexSummary}
          indexTitle={chrome.indexTitle}
          label={copy.navigation.label}
          links={links}
          metadata={{
            packs: catalog.packs.length,
            skills: catalog.skills.length,
            version: catalog.version,
          }}
          openLabel={copy.navigation.open}
          versionLabel={chrome.versionLabel}
        />
      </div>
    </header>
  );
}
