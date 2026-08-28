import type { SkillCatalogItem } from "@/lib/skill-filters";

export function SkillCard({
  skill,
  labels,
}: Readonly<{
  skill: SkillCatalogItem;
  labels: Readonly<{
    benefit: string;
    category: string;
    tags: string;
    values: Readonly<Record<string, string>>;
    categories: Readonly<Record<string, string>>;
  }>;
}>) {
  return (
    <article className="skill-card">
      <div className="skill-card__meta">
        <span>{labels.values[skill.difficulty] ?? skill.difficulty}</span>
        <span>{labels.values[skill.maturity] ?? skill.maturity}</span>
      </div>
      <h2>{skill.displayName}</h2>
      <p>{skill.summary}</p>
      <dl className="skill-card__details">
        <div>
          <dt>{labels.benefit}</dt>
          <dd>{skill.primaryBenefit}</dd>
        </div>
        <div>
          <dt>{labels.category}</dt>
          <dd>{labels.categories[skill.category] ?? skill.category.replaceAll("-", " ")}</dd>
        </div>
      </dl>
      <ul className="skill-card__tags" aria-label={labels.tags}>
        {skill.tags.slice(0, 4).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}
