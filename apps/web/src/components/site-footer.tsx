import type { Route } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { messages } from "@/lib/messages";

const repositoryUrl = "https://github.com/jhonatan-oliveiradev/agent-skills";

export function SiteFooter({ locale }: Readonly<{ locale: Locale }>) {
  const copy = messages[locale];
  const catalog = getCatalog();
  const links = [
    ["/skills", copy.navigation.skills],
    ["/packs", copy.navigation.packs],
    ["/roadmap", copy.navigation.roadmap],
    ["/about", copy.navigation.about],
  ] as const;

  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <p className="site-footer__brand">{copy.brandLabel}</p>
          <p className="site-footer__summary">{copy.footer.summary}</p>
          <p className="site-footer__version">
            {copy.footer.version.replace("{version}", catalog.version)}
          </p>
        </div>
        <nav aria-label={copy.footer.navigationLabel}>
          <ul className="footer-navigation">
            {links.map(([path, label]) => (
              <li key={path}>
                <Link href={localizePath(path, locale) as Route}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-external-links">
          <a href={repositoryUrl} rel="noreferrer noopener" target="_blank">
            {copy.footer.source}
          </a>
          <a
            href={`${repositoryUrl}/issues`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {copy.footer.contribute}
          </a>
        </div>
      </div>
    </footer>
  );
}
