export interface SkillCatalogItem {
  readonly slug: string;
  readonly category: string;
  readonly packs: readonly string[];
  readonly maturity: string;
  readonly difficulty: string;
  readonly tags: readonly string[];
  readonly displayName: string;
  readonly summary: string;
  readonly primaryBenefit: string;
}

export interface SkillFilters {
  readonly query?: string;
  readonly category?: string;
  readonly pack?: string;
  readonly difficulty?: string;
  readonly maturity?: string;
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

export function filterSkills<T extends SkillCatalogItem>(
  skills: readonly T[],
  filters: SkillFilters,
): T[] {
  const query = normalize(filters.query ?? "");

  return skills.filter((skill) => {
    if (filters.category && skill.category !== filters.category) return false;
    if (filters.pack && !skill.packs.includes(filters.pack)) return false;
    if (filters.difficulty && skill.difficulty !== filters.difficulty) return false;
    if (filters.maturity && skill.maturity !== filters.maturity) return false;
    if (!query) return true;

    return normalize(
      [
        skill.displayName,
        skill.summary,
        skill.primaryBenefit,
        skill.slug,
        ...skill.tags,
      ].join(" "),
    ).includes(query);
  });
}
