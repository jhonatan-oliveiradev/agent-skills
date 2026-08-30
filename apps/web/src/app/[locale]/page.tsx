import type { Metadata, Route } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { EditorialHeroMotion } from "@/components/motion/editorial-hero-motion";
import { MethodEngine } from "@/components/motion/method-engine";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { resolveLocale } from "@/components/foundation-route";
import { getBuiltWithSkillsCases } from "@/lib/built-with-skills";
import { getCatalog, getLocalizedPacks } from "@/lib/catalog";
import { localizePath } from "@/lib/i18n";
import { messages } from "@/lib/messages";
import { homeManifesto } from "@/lib/home-content";

type HomePageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const copy = messages[locale].metadata;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "pt-BR": "/pt-BR",
        "x-default": "/en",
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = await resolveLocale(params);
  const copy = messages[locale];
  const manifesto = homeManifesto[locale];
  const catalog = getCatalog();
  const activePacks = getLocalizedPacks(locale).filter((pack) => pack.status === "active");
  const cases = getBuiltWithSkillsCases(locale);
  const metrics = [
    [catalog.skills.length, copy.catalog.skillsCount],
    [catalog.packs.length, copy.catalog.packsCount],
    [catalog.locales.length, copy.catalog.localesCount],
  ] as const;
  const localizedMetrics = metrics.map(([count, label]) => `${count} ${label}`);
  const steps = [copy.process.choose, copy.process.install, copy.process.invoke];
  const paths = [
    { ...copy.home.paths.skills, href: "/skills" },
    { ...copy.home.paths.packs, href: "/packs" },
    { ...copy.home.paths.guide, href: "/getting-started" },
  ] as const;

  return (
    <>
      <ScrollProgress />
      <section aria-labelledby="home-manifesto-title" className="relative">
        <EditorialHeroMotion
          eyebrow={manifesto.eyebrow}
          summary={manifesto.summary}
          title={<><span id="home-manifesto-title">{manifesto.titleLead}</span><br />{" "}{manifesto.titleClose}</>}
          engine={<MethodEngine copy={manifesto.engine} metrics={localizedMetrics} />}
        >
          <div className="flex flex-wrap gap-3">
              <Link
                className="button button--primary"
                href={localizePath("/skills", locale) as Route}
              >
                {manifesto.primaryAction}
              </Link>
              <Link
                className="button button--secondary"
                href={localizePath(manifesto.secondaryHref, locale) as Route}
              >
                {manifesto.secondaryAction}
              </Link>
          </div>
        </EditorialHeroMotion>
      </section>

      <section className="home-paths">
        <div className="shell">
          <div className="home-section-heading">
            <div><p className="eyebrow">{copy.home.paths.eyebrow}</p><h2>{copy.home.paths.title}</h2></div>
            <p>{copy.home.paths.summary}</p>
          </div>
          <div className="home-path-grid">
            {paths.map((path, index) => (
              <article key={path.href}>
                <span>0{index + 1}</span>
                <h3>{path.title}</h3>
                <p>{path.summary}</p>
                <Link href={localizePath(path.href, locale) as Route}>{path.action} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-packs">
        <div className="shell">
          <div className="home-section-heading">
            <div><p className="eyebrow">{copy.home.packs.eyebrow}</p><h2>{copy.home.packs.title}</h2></div>
            <div><p>{copy.home.packs.summary}</p><Link href={localizePath("/packs", locale) as Route}>{copy.home.packs.viewAll} →</Link></div>
          </div>
          <div className="home-pack-grid">
            {activePacks.map((pack) => (
              <article className="home-pack-card" key={pack.slug} style={{ "--home-accent": pack.color } as CSSProperties}>
                <div><span>{copy.home.packs.skills.replace("{count}", String(pack.skills.length))}</span><span>{pack.version}</span></div>
                <h3>{pack.name}</h3>
                <p>{pack.summary}</p>
                <Link href={`/${locale}/packs/${pack.slug}` as Route}>{copy.home.packs.view} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="shell">
          <div className="section-heading">
            <h2>{copy.process.title}</h2>
            <p>{copy.process.summary}</p>
          </div>
          <ol className="process-grid">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true" className="step-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-proof">
        <div className="shell">
          <div className="home-section-heading">
            <div><p className="eyebrow">{copy.home.proof.eyebrow}</p><h2>{copy.home.proof.title}</h2></div>
            <div><p>{copy.home.proof.summary}</p><Link href={localizePath("/built-with-skills", locale) as Route}>{copy.home.proof.viewAll} →</Link></div>
          </div>
          <div className="home-case-grid">
            {cases.map((item, index) => (
              <article className="home-case-card" key={item.slug}>
                <div><span>0{index + 1}</span><span>{item.date}</span></div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <Link href={`/${locale}/built-with-skills/${item.slug}` as Route}>{copy.home.proof.view} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-roadmap">
        <div className="shell home-roadmap__inner">
          <div><p className="eyebrow">{copy.home.roadmap.eyebrow}</p><h2>{copy.home.roadmap.title}</h2><p>{copy.home.roadmap.summary}</p></div>
          <div className="hero-actions">
            <Link className="button button--primary" href={localizePath("/roadmap", locale) as Route}>{copy.home.roadmap.action}</Link>
            <Link className="button button--secondary" href={localizePath("/contribute", locale) as Route}>{copy.home.roadmap.contribute}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
