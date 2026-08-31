"use client";

import type { Route } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SkillCatalogItem } from "@/lib/skill-filters";

export function PackCompositionMap({
  skills,
  locale,
  labels,
}: Readonly<{
  skills: readonly SkillCatalogItem[];
  locale: string;
  labels: Readonly<{
    composition: string;
    benefit: string;
    pending: string;
  }>;
}>) {
  const [activeSlug, setActiveSlug] = useState<string | null>(skills[0]?.slug ?? null);
  const activeSkill = useMemo(
    () => skills.find((skill) => skill.slug === activeSlug) ?? skills[0],
    [activeSlug, skills],
  );

  return (
    <section
      className="pack-composition-map"
      data-pack-composition-map
      onMouseLeave={() => setActiveSlug(skills[0]?.slug ?? null)}
    >
      <div className="pack-composition-map__heading">
        <p className="eyebrow">{String(skills.length).padStart(2, "0")}</p>
        <h2>{labels.composition}</h2>
      </div>

      {skills.length ? (
        <div className="pack-composition-map__grid">
          <ol className="pack-composition-map__sequence">
            {skills.map((skill, index) => {
              const active = skill.slug === activeSkill?.slug;
              return (
                <li key={skill.slug} data-active={active}>
                  <Link
                    data-interaction="connect"
                    href={`/${locale}/skills/${skill.slug}` as Route}
                    onMouseEnter={() => setActiveSlug(skill.slug)}
                    onFocus={() => setActiveSlug(skill.slug)}
                  >
                    <span className="pack-composition-map__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pack-composition-map__method">{skill.displayName}</span>
                    <span className="pack-composition-map__arrow" aria-hidden="true">↗</span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <aside className="pack-composition-map__context" aria-live="polite">
            <p>{labels.benefit}</p>
            <strong>{activeSkill?.displayName}</strong>
            <span>{activeSkill?.primaryBenefit}</span>
          </aside>
        </div>
      ) : (
        <div className="pack-composition-map__pending" data-composition-pending>
          <span aria-hidden="true">—</span>
          <p>{labels.pending}</p>
        </div>
      )}
    </section>
  );
}
