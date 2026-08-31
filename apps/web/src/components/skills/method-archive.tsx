"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";
import type { Messages } from "@/lib/messages";
import {
  filterSkills,
  type SkillCatalogItem,
  type SkillFilters,
} from "@/lib/skill-filters";
import { MethodRow } from "./method-row";

interface FilterOption {
  readonly value: string;
  readonly label: string;
}

type ArchiveOptions = Readonly<
  Record<"categories" | "packs" | "difficulties" | "maturities", readonly FilterOption[]>
>;

export function MethodArchive({
  skills,
  options,
  copy,
  locale,
  filterLabel,
}: Readonly<{
  skills: readonly SkillCatalogItem[];
  options: ArchiveOptions;
  copy: Messages["skillsCatalog"];
  locale: string;
  filterLabel: string;
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
  const hasActiveFilters = Object.values(filters).some(Boolean);

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
      <label className="method-archive__select">
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
    <section className="method-archive" data-method-archive>
      <div className="method-archive__controls" aria-label={filterLabel}>
        <label className="method-archive__search">
          <span>{copy.searchLabel}</span>
          <input
            type="search"
            value={filters.query}
            placeholder={copy.searchPlaceholder}
            onChange={(event) => updateFilter("query", event.target.value)}
          />
        </label>

        <div className="method-archive__categories" role="group" aria-label={copy.category}>
          <button
            type="button"
            data-active={!filters.category}
            onClick={() => updateFilter("category", "")}
          >
            {copy.all}
          </button>
          {options.categories.map((option) => {
            const active = filters.category === option.value;
            return (
              <button
                type="button"
                data-active={active}
                key={option.value}
                onClick={() => updateFilter("category", active ? "" : option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="method-archive__secondary-filters">
          {selectFilter(copy.pack, "pack", options.packs)}
          {selectFilter(copy.difficulty, "difficulty", options.difficulties)}
          {selectFilter(copy.maturity, "maturity", options.maturities)}
        </div>

        <div className="method-archive__summary" aria-live="polite">
          <strong>{copy.results.replace("{count}", String(results.length))}</strong>
          {hasActiveFilters ? (
            <button type="button" onClick={clearFilters}>
              {copy.clear}
            </button>
          ) : null}
        </div>
      </div>

      {results.length ? (
        <div className="method-archive__list">
          {results.map((skill) => (
            <MethodRow
              key={skill.slug}
              skill={skill}
              index={skills.findIndex((candidate) => candidate.slug === skill.slug)}
              href={`/${locale}/skills/${skill.slug}`}
              labels={{
                benefit: copy.benefit,
                category: copy.categories[skill.category] ?? skill.category.replaceAll("-", " "),
                difficulty: copy.values[skill.difficulty as keyof typeof copy.values] ?? skill.difficulty,
                maturity: copy.values[skill.maturity as keyof typeof copy.values] ?? skill.maturity,
              }}
            />
          ))}
        </div>
      ) : (
        <section className="catalog-empty method-archive__empty">
          <h2>{copy.noResultsTitle}</h2>
          <p>{copy.noResultsSummary}</p>
          <button type="button" className="button button--secondary" onClick={clearFilters}>
            {copy.clear}
          </button>
        </section>
      )}
    </section>
  );
}
