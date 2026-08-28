import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBuiltWithSkillsCaseBySlug, getBuiltWithSkillsSlugs } from "@/lib/built-with-skills";
import { getLocalizedSkillBySlug, getSupportedLocales } from "@/lib/catalog";
import { isLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string; slug: string }> }>;

export function generateStaticParams() {
  return getSupportedLocales().flatMap((locale) => getBuiltWithSkillsSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = getBuiltWithSkillsCaseBySlug(locale, slug);
  if (!item) return {};
  const path = `/${locale}/built-with-skills/${slug}`;
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: path, languages: { en: `/en/built-with-skills/${slug}`, "pt-BR": `/pt-BR/built-with-skills/${slug}`, "x-default": `/en/built-with-skills/${slug}` } },
    openGraph: { type: "article", title: item.title, description: item.summary, url: path, locale: locale === "pt-BR" ? "pt_BR" : "en_US" },
  };
}

export default async function BuiltWithSkillsDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = getBuiltWithSkillsCaseBySlug(locale, slug);
  if (!item) notFound();
  const copy = messages[locale].builtWithSkills;
  const skills = item.skills.map((skillSlug) => getLocalizedSkillBySlug(locale, skillSlug)!);
  return (
    <article className="shell built-case-detail">
      <Link className="skill-detail__back" href={`/${locale}/built-with-skills` as Route}>← {copy.back}</Link>
      <header className="built-case-detail__hero">
        <div><p className="eyebrow">{copy.caseStudy}</p><h1>{item.title}</h1><p>{item.summary}</p></div>
        <dl><div><dt>{copy.published}</dt><dd>{item.date}</dd></div><div><dt>{copy.skillsApplied}</dt><dd>{item.skills.length}</dd></div></dl>
      </header>
      <section className="built-case-detail__challenge"><p className="eyebrow">{copy.challenge}</p><h2>{item.challenge}</h2></section>
      <section className="built-case-detail__skills">
        <div><p className="eyebrow">{copy.skillsApplied}</p><h2>{copy.workflowsTitle}</h2></div>
        <ul>{skills.map((skill) => <li key={skill.slug}><Link aria-label={skill.displayName} href={`/${locale}/skills/${skill.slug}` as Route}><span>{skill.displayName}</span><span>{skill.primaryBenefit}</span></Link></li>)}</ul>
      </section>
      <section className="built-case-detail__decisions">
        <div><p className="eyebrow">{copy.decisions}</p><h2>{copy.decisionsTitle}</h2></div>
        <ol>{item.decisions.map((decision, index) => <li key={decision.title}><span>0{index + 1}</span><h3>{decision.title}</h3><p>{decision.summary}</p></li>)}</ol>
      </section>
      <section className="built-case-detail__results">
        <div><p className="eyebrow">{copy.results}</p><h2>{copy.resultsTitle}</h2></div>
        <ul>{item.results.map((result) => <li key={result}>{result}</li>)}</ul>
      </section>
      <a aria-label={copy.evidence} className="built-case-detail__evidence" href={`https://github.com/jhonatan-oliveiradev/agent-skills/blob/main/${item.sourcePath}`} rel="noreferrer noopener" target="_blank">{copy.evidence} ↗</a>
    </article>
  );
}
