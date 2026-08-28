import type { Metadata, Route } from "next";
import Link from "next/link";
import { resolveLocale } from "@/components/foundation-route";
import { getBuiltWithSkillsCases } from "@/lib/built-with-skills";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const copy = messages[locale].builtWithSkills;
  return {
    title: copy.title,
    description: copy.summary,
    alternates: {
      canonical: `/${locale}/built-with-skills`,
      languages: { en: "/en/built-with-skills", "pt-BR": "/pt-BR/built-with-skills", "x-default": "/en/built-with-skills" },
    },
  };
}

export default async function BuiltWithSkillsPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const copy = messages[locale].builtWithSkills;
  const cases = getBuiltWithSkillsCases(locale);
  return (
    <article className="shell built-with-page">
      <header className="built-with__hero">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.summary}</p>
      </header>
      <section className="built-case-grid" aria-label={copy.casesLabel}>
        {cases.map((item, index) => (
          <article className="built-case-card" key={item.slug}>
            <Link href={`/${locale}/built-with-skills/${item.slug}` as Route}>
              <div className="built-case-card__meta"><span>0{index + 1}</span><span>{item.date}</span></div>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <ul aria-label={copy.skillsApplied}>{item.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              <span className="built-case-card__action">{copy.readCase} →</span>
            </Link>
          </article>
        ))}
      </section>
    </article>
  );
}
