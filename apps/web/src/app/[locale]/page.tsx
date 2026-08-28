import type { Metadata, Route } from "next";
import Link from "next/link";
import { resolveLocale } from "@/components/foundation-route";
import { getCatalog } from "@/lib/catalog";
import { localizePath } from "@/lib/i18n";
import { messages } from "@/lib/messages";

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
  const catalog = getCatalog();
  const metrics = [
    [catalog.skills.length, copy.catalog.skillsCount],
    [catalog.packs.length, copy.catalog.packsCount],
    [catalog.locales.length, copy.catalog.localesCount],
  ] as const;
  const steps = [copy.process.choose, copy.process.install, copy.process.invoke];

  return (
    <>
      <section className="hero-section">
        <div className="shell hero-section__grid">
          <div>
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <p className="hero-section__summary">{copy.hero.summary}</p>
            <div className="hero-actions">
              <Link
                className="button button--primary"
                href={localizePath("/skills", locale) as Route}
              >
                {copy.hero.primaryAction}
              </Link>
              <Link
                className="button button--secondary"
                href={localizePath("/packs", locale) as Route}
              >
                {copy.hero.secondaryAction}
              </Link>
            </div>
          </div>
          <ul aria-label={copy.hero.summary} className="catalog-metrics">
            {metrics.map(([count, label]) => (
              <li key={label}>{`${count} ${label}`}</li>
            ))}
          </ul>
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
          <aside className="status-note">{copy.hero.foundationNote}</aside>
        </div>
      </section>
    </>
  );
}
