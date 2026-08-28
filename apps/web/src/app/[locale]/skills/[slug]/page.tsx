import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyCommand } from "@/components/copy-command";
import {
  getCatalog,
  getLocalizedPackNames,
  getLocalizedSkillBySlug,
  getSkillInstallCommands,
} from "@/lib/catalog";
import { isLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

const repositoryUrl = "https://github.com/jhonatan-oliveiradev/agent-skills";

type SkillPageProps = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export function generateStaticParams() {
  return getCatalog().skills.flatMap((skill) =>
    getCatalog().locales.map((locale) => ({ locale, slug: skill.slug })),
  );
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const skill = getLocalizedSkillBySlug(locale, slug);
  if (!skill) return {};

  const path = `/${locale}/skills/${slug}`;
  return {
    title: skill.displayName,
    description: skill.summary,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/skills/${slug}`,
        "pt-BR": `/pt-BR/skills/${slug}`,
        "x-default": `/en/skills/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: skill.displayName,
      description: skill.summary,
      url: path,
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
    },
  };
}

export default async function SkillDetailPage({ params }: SkillPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const skill = getLocalizedSkillBySlug(locale, slug);
  if (!skill) notFound();

  const copy = messages[locale];
  const detail = copy.skillDetail;
  const categoryNames: Readonly<Record<string, string>> = copy.skillsCatalog.categories;
  const commands = getSkillInstallCommands(skill.slug);
  const packNames = getLocalizedPackNames(locale);
  const category = categoryNames[skill.category] ?? skill.category;
  const difficulty = copy.skillsCatalog.values[skill.difficulty as keyof typeof copy.skillsCatalog.values] ?? skill.difficulty;
  const maturity = copy.skillsCatalog.values[skill.maturity as keyof typeof copy.skillsCatalog.values] ?? skill.maturity;
  const sourceUrl = `${repositoryUrl}/tree/main/skills/${skill.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: skill.displayName,
    description: skill.summary,
    inLanguage: locale,
    dateModified: skill.updatedAt,
    version: skill.version,
    url: `https://skills.jhonatanoliveira.com/${locale}/skills/${skill.slug}`,
  };

  return (
    <article className="shell skill-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Link className="skill-detail__back" href={`/${locale}/skills` as Route}>
        ← {detail.back}
      </Link>

      <header className="skill-detail__hero">
        <div>
          <p className="eyebrow">{category}</p>
          <h1>{skill.displayName}</h1>
          <p className="skill-detail__summary">{skill.summary}</p>
        </div>
        <dl className="skill-detail__facts">
          <div><dt>{copy.skillsCatalog.difficulty}</dt><dd>{difficulty}</dd></div>
          <div><dt>{copy.skillsCatalog.maturity}</dt><dd>{maturity}</dd></div>
          <div><dt>{detail.version}</dt><dd>{skill.version}</dd></div>
          <div><dt>{detail.updated}</dt><dd>{skill.updatedAt}</dd></div>
        </dl>
      </header>

      <section className="skill-detail__benefit" aria-labelledby="benefit-title">
        <p id="benefit-title">{detail.benefit}</p>
        <strong>{skill.primaryBenefit}</strong>
      </section>

      <div className="skill-detail__content">
        <div className="skill-detail__main">
          <section><h2>{detail.whenToUse}</h2><p>{skill.whenToUse}</p></section>
          <section><h2>{detail.whenNotToUse}</h2><p>{skill.whenNotToUse}</p></section>
          <section>
            <h2>{detail.useCases}</h2>
            <ul className="detail-list">{skill.useCases.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h2>{detail.examplePrompts}</h2>
            <div className="prompt-list">
              {skill.examplePrompts.map((prompt) => (
                <CopyCommand key={prompt} command={prompt} label={detail.copy} copiedLabel={detail.copied} />
              ))}
            </div>
          </section>
          <section className="installation-panel">
            <h2>{detail.installation}</h2>
            <p>{detail.installationSummary}</p>
            <h3>{detail.bash}</h3>
            <CopyCommand command={commands.bash} label={detail.copy} copiedLabel={detail.copied} />
            <h3>{detail.powershell}</h3>
            <CopyCommand command={commands.powershell} label={detail.copy} copiedLabel={detail.copied} />
          </section>
        </div>

        <aside className="skill-detail__aside">
          <section>
            <h2>{detail.compatibility}</h2>
            <dl className="detail-fact-list">
              <div><dt>{detail.surfaces}</dt><dd>{skill.compatibility.surfaces.join(", ")}</dd></div>
              <div><dt>{detail.operatingSystems}</dt><dd>{skill.compatibility.operatingSystems.join(", ")}</dd></div>
              <div><dt>{detail.installModes}</dt><dd>{skill.compatibility.installModes.join(", ")}</dd></div>
            </dl>
          </section>
          <section>
            <h2>{detail.dependencies}</h2>
            {skill.dependencies.length ? (
              <ul className="detail-link-list">
                {skill.dependencies.map((dependency) => (
                  <li key={dependency.name}>
                    {dependency.url ? <a href={dependency.url} rel="noreferrer noopener" target="_blank">{dependency.name}</a> : dependency.name}
                  </li>
                ))}
              </ul>
            ) : <p>{detail.noDependencies}</p>}
          </section>
          {skill.packs.length ? (
            <section><h2>{detail.packs}</h2><ul className="detail-link-list">{skill.packs.map((pack) => <li key={pack}>{packNames[pack] ?? pack}</li>)}</ul></section>
          ) : null}
          {skill.relatedSkills.length ? (
            <section>
              <h2>{detail.relatedSkills}</h2>
              <ul className="detail-link-list">{skill.relatedSkills.map((related) => <li key={related.slug}><Link href={`/${locale}/skills/${related.slug}` as Route}>{related.displayName}</Link></li>)}</ul>
            </section>
          ) : null}
          <a className="button button--secondary skill-detail__source" href={sourceUrl} rel="noreferrer noopener" target="_blank">{detail.source}</a>
        </aside>
      </div>
    </article>
  );
}
