"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";
import {
  filterSkills,
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
  locale,
}: Readonly<{
  skills: readonly SkillCatalogItem[];
  options: Readonly<Record<"categories" | "packs" | "difficulties" | "maturities", readonly FilterOption[]>>;
  copy: SkillsCatalogCopy;
  locale: string;
}>) {
  const [queryState, setQueryState] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      category: parseAsString.withDefault(""),
      pack: parseAsString.withDefault(""),
      difficulty: parseAsString.withDefault(""),
      maturity: parseAsString.withDefault(""),
    },
    { history: "replace", shallow: true, clearOnDefault: true },
  );
  const filters = useMemo<Required<SkillFilters>>(
    () => ({ query: queryState.q, ...queryState }),
    [queryState],
  );
  const results = useMemo(() => filterSkills(skills, filters), [skills, filters]);

  function updateFilter(key: keyof SkillFilters, value: string) {
    const queryKey = key === "query" ? "q" : key;
    void setQueryState({ [queryKey]: value || null });
  }

  function clearFilters() {
    void setQueryState({ q: null, category: null, pack: null, difficulty: null, maturity: null });
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
          {Object.values(filters).some(Boolean) ? (
            <button type="button" onClick={clearFilters}>
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
              href={`/${locale}/skills/${skill.slug}`}
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
          <button type="button" className="button button--secondary" onClick={clearFilters}>
            {copy.clear}
          </button>
        </section>
      )}
    </>
  );
}
