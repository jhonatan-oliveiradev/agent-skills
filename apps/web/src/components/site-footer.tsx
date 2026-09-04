import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { messages } from "@/lib/messages";
import { siteChromeCopy } from "@/lib/site-chrome-copy";

const repositoryUrl = "https://github.com/jhonatan-oliveiradev/agent-skills";
const portfolioUrl = "https://jhonatanoliveira.com";

export function SiteFooter({ locale }: Readonly<{ locale: Locale }>) {
  const copy = messages[locale];
  const chrome = siteChromeCopy[locale].footer;
  const catalog = getCatalog();
  const provenance = chrome.provenance
    .replace("{skills}", String(catalog.skills.length))
    .replace("{packs}", String(catalog.packs.length));

  const exploreLinks = [
    ["/skills", copy.navigation.skills],
    ["/packs", copy.navigation.packs],
    ["/built-with-skills", copy.navigation.builtWithSkills],
  ] as const;

  const projectLinks = [
    ["/getting-started", copy.navigation.gettingStarted],
    ["/roadmap", copy.navigation.roadmap],
    ["/about", copy.navigation.about],
    ["/changelog", copy.navigation.changelog],
    ["/contribute", copy.navigation.contribute],
  ] as const;

  return (
    <footer className="site-footer" data-footer-mode="end-matter">
      <div className="shell site-footer__intro">
        <p className="site-footer__eyebrow">{chrome.eyebrow}</p>
        <div className="site-footer__manifesto-grid">
          <h2>{chrome.manifesto}</h2>
          <p>{chrome.summary}</p>
        </div>
      </div>

      <div className="shell site-footer__body">
        <nav aria-label={copy.footer.navigationLabel} className="site-footer__directory">
          <div className="site-footer__column">
            <h3>{chrome.explore}</h3>
            <ul>
              {exploreLinks.map(([path, label]) => (
                <li key={path}>
                  <Link href={localizePath(path, locale) as Route}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__column">
            <h3>{chrome.project}</h3>
            <ul>
              {projectLinks.map(([path, label]) => (
                <li key={path}>
                  <Link href={localizePath(path, locale) as Route}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__column site-footer__column--source">
            <h3>{chrome.source}</h3>
            <ul>
              <li>
                <a href={repositoryUrl} rel="noreferrer noopener" target="_blank">
                  {copy.footer.source}
                </a>
              </li>
              <li>
                <a href={`${repositoryUrl}/issues`} rel="noreferrer noopener" target="_blank">
                  {copy.footer.contribute}
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__column site-footer__collection">
            <h3>{chrome.collection}</h3>
            <dl>
              <div>
                <dt>{chrome.releaseLabel}</dt>
                <dd>{copy.footer.version.replace("{version}", catalog.version)}</dd>
              </div>
              <div>
                <dt>{chrome.methodsLabel}</dt>
                <dd>{catalog.skills.length} skills</dd>
              </div>
              <div>
                <dt>{chrome.packsLabel}</dt>
                <dd>{catalog.packs.length} packs</dd>
              </div>
            </dl>
          </div>
        </nav>
      </div>

      <div
        className="site-footer__wordmark-wrap"
        aria-hidden="true"
        style={{
          alignItems: "center",
          background: "#0b0810",
          display: "flex",
          justifyContent: "center",
          padding: "clamp(2.5rem, 7vw, 6rem) clamp(1.25rem, 5vw, 4rem)",
        }}
      >
        <Image
          className="site-footer__brand-logo"
          height={290}
          src="/brand/agent-skills-logo-horizontal.svg"
          style={{ height: "auto", width: "min(86vw, 58rem)" }}
          width={745}
          alt=""
        />
      </div>

      <div className="shell site-footer__signature">
        <p>© {new Date().getFullYear()} Agent Skills Studio</p>
        <p className="site-footer__provenance">{provenance}</p>
        <a href={portfolioUrl} rel="author noreferrer" target="_blank">
          {copy.footer.signature}<span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
