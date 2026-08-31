import type { Route } from "next";
import Link from "next/link";
import type { SkillCatalogItem } from "@/lib/skill-filters";

export interface MethodRowLabels {
  readonly category: string;
  readonly difficulty: string;
  readonly maturity: string;
  readonly benefit: string;
}

export function MethodRow({
  skill,
  index,
  href,
  labels,
}: Readonly<{
  skill: SkillCatalogItem;
  index: number;
  href: string;
  labels: MethodRowLabels;
}>) {
  return (
    <article className="method-row" data-method-row>
      <Link className="method-row__link" data-interaction="navigate" href={href as Route}>
        <div className="method-row__index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="method-row__identity">
          <p className="method-row__category">{labels.category}</p>
          <h2 className="method-row__title">{skill.displayName}</h2>
          <p className="method-row__summary">{skill.summary}</p>
          <p className="method-row__benefit">
            <span>{labels.benefit}</span>
            {skill.primaryBenefit}
          </p>
        </div>

        <div className="method-row__meta" data-interaction="inspect">
          <span>{labels.difficulty}</span>
          <span>{labels.maturity}</span>
        </div>

        <span className="method-row__arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
    </article>
  );
}
