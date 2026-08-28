import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyCommand } from "@/components/copy-command";
import { SkillCard } from "@/components/skill-card";
import {
  getCatalog,
  getLocalizedPackBySlug,
  getPackInstallCommands,
} from "@/lib/catalog";
import { isLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

type PackPageProps = Readonly<{ params: Promise<{ locale: string; slug: string }> }>;

export function generateStaticParams() {
  return getCatalog().packs.flatMap((pack) =>
    getCatalog().locales.map((locale) => ({ locale, slug: pack.slug })),
  );
}

export async function generateMetadata({ params }: PackPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const pack = getLocalizedPackBySlug(locale, slug);
  if (!pack) return {};

  const path = `/${locale}/packs/${slug}`;
  return {
    title: pack.name,
    description: pack.summary,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/packs/${slug}`,
        "pt-BR": `/pt-BR/packs/${slug}`,
        "x-default": `/en/packs/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      title: pack.name,
      description: pack.summary,
      url: path,
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
    },
  };
}

export default async function PackDetailPage({ params }: PackPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const pack = getLocalizedPackBySlug(locale, slug);
  if (!pack) notFound();

  const copy = messages[locale];
  const detail = copy.packDetail;
  const commands = getPackInstallCommands(pack.slug, pack.status);
  const status = pack.status === "active" ? detail.active : detail.planned;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pack.name,
    description: pack.summary,
    inLanguage: locale,
    url: `https://skills.jhonatanoliveira.com/${locale}/packs/${pack.slug}`,
    numberOfItems: pack.skills.length,
  };

  return (
    <article className="shell pack-detail-page" data-color={pack.color}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Link className="skill-detail__back" href={`/${locale}/packs` as Route}>
        ← {detail.back}
      </Link>

      <header className="pack-detail__hero">
        <div>
          <p className="eyebrow">{status}</p>
          <h1>{pack.name}</h1>
          <p className="pack-detail__summary">{pack.summary}</p>
        </div>
        <dl className="skill-detail__facts">
          <div><dt>{detail.skills}</dt><dd>{pack.skills.length}</dd></div>
          <div><dt>{detail.version}</dt><dd>{pack.version}</dd></div>
        </dl>
      </header>

      <div className="pack-detail__intro">
        <p>{pack.description}</p>
        <section>
          <h2>{detail.outcomes}</h2>
          <ul className="detail-list">
            {pack.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
          </ul>
        </section>
      </div>

      {commands ? (
        <section className="installation-panel pack-installation">
          <div>
            <h2>{detail.installation}</h2>
            <p>{detail.installationSummary}</p>
          </div>
          <div>
            <h3>{detail.bash}</h3>
            <CopyCommand command={commands.bash} label={detail.copy} copiedLabel={detail.copied} />
            <h3>{detail.powershell}</h3>
            <CopyCommand command={commands.powershell} label={detail.copy} copiedLabel={detail.copied} />
          </div>
        </section>
      ) : (
        <section className="planned-pack-note">
          <p className="eyebrow">{detail.planned}</p>
          <h2>{detail.plannedTitle}</h2>
          <p>{detail.plannedSummary}</p>
        </section>
      )}

      {pack.skills.length ? (
        <section className="pack-composition">
          <div className="pack-composition__heading">
            <p className="eyebrow">{String(pack.skills.length).padStart(2, "0")}</p>
            <h2>{detail.composition}</h2>
          </div>
          <div className="skill-grid">
            {pack.skills.map((skill) => (
              <SkillCard
                key={skill.slug}
                skill={skill}
                href={`/${locale}/skills/${skill.slug}`}
                labels={{
                  benefit: copy.skillsCatalog.benefit,
                  category: copy.skillsCatalog.category,
                  tags: copy.skillsCatalog.tags,
                  values: copy.skillsCatalog.values,
                  categories: copy.skillsCatalog.categories,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
