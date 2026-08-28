"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useMemo } from "react";
import {
  filterSkills,
  parseSkillFilters,
  serializeSkillFilters,
  type SkillCatalogItem,
  type SkillFilters,
} from "@/lib/skill-filters";
import { SkillCard } from "./skill-card";

interface FilterOption {
  readonly value: string;
  readonly label: string;
}

interface SkillsCatalogCopy {
  readonly searchLabel: string;
  readonly searchPlaceholder: string;
  readonly category: string;
  readonly pack: string;
  readonly difficulty: string;
  readonly maturity: string;
  readonly all: string;
  readonly results: string;
  readonly noResultsTitle: string;
  readonly noResultsSummary: string;
  readonly clear: string;
  readonly benefit: string;
  readonly tags: string;
  readonly values: Readonly<Record<string, string>>;
  readonly categories: Readonly<Record<string, string>>;
}

export function SkillsCatalog({
  skills,
  options,
  copy,
}: Readonly<{
  skills: readonly SkillCatalogItem[];
  options: Readonly<Record<"categories" | "packs" | "difficulties" | "maturities", readonly FilterOption[]>>;
  copy: SkillsCatalogCopy;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseSkillFilters(searchParams), [searchParams]);
  const results = useMemo(() => filterSkills(skills, filters), [skills, filters]);

  function replaceUrl(url: string) {
    router.replace(url as Route, { scroll: false });
  }

  function updateFilter(key: keyof SkillFilters, value: string) {
    const query = serializeSkillFilters({ ...filters, [key]: value });
    replaceUrl(query ? `${pathname}?${query}` : pathname);
  }

  function selectFilter(
    label: string,
    key: keyof SkillFilters,
    values: readonly FilterOption[],
  ) {
    return (
      <label>
        <span>{label}</span>
        <select value={filters[key]} onChange={(event) => updateFilter(key, event.target.value)}>
          <option value="">{copy.all}</option>
          {values.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <>
      <section className="catalog-toolbar" aria-label={copy.results.replace("{count}", String(results.length))}>
        <label className="catalog-search">
          <span>{copy.searchLabel}</span>
          <input
            type="search"
            value={filters.query}
            placeholder={copy.searchPlaceholder}
            onChange={(event) => updateFilter("query", event.target.value)}
          />
        </label>
        <div className="catalog-filters">
          {selectFilter(copy.category, "category", options.categories)}
          {selectFilter(copy.pack, "pack", options.packs)}
          {selectFilter(copy.difficulty, "difficulty", options.difficulties)}
          {selectFilter(copy.maturity, "maturity", options.maturities)}
        </div>
        <div className="catalog-toolbar__summary" aria-live="polite">
          <strong>{copy.results.replace("{count}", String(results.length))}</strong>
          {serializeSkillFilters(filters) ? (
            <button type="button" onClick={() => replaceUrl(pathname)}>
              {copy.clear}
            </button>
          ) : null}
        </div>
      </section>

      {results.length ? (
        <section className="skill-grid">
          {results.map((skill) => (
            <SkillCard
              key={skill.slug}
              skill={skill}
              labels={{
                benefit: copy.benefit,
                category: copy.category,
                tags: copy.tags,
                values: copy.values,
                categories: copy.categories,
              }}
            />
          ))}
        </section>
      ) : (
        <section className="catalog-empty">
          <h2>{copy.noResultsTitle}</h2>
          <p>{copy.noResultsSummary}</p>
          <button type="button" className="button button--secondary" onClick={() => replaceUrl(pathname)}>
            {copy.clear}
          </button>
        </section>
      )}
    </>
  );
}
