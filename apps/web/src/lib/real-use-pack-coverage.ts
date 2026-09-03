import "server-only";

import {
  getBuiltWithSkillsCases,
  hasInspectableRealUseEvidence,
} from "./built-with-skills";
import { getCatalog } from "./catalog";

export interface RealUsePackCoverage {
  readonly coveredPackSlugs: readonly string[];
  readonly uncoveredPackSlugs: readonly string[];
  readonly coveredCount: number;
  readonly totalActivePacks: number;
}

export function getRealUsePackCoverage(): RealUsePackCoverage {
  const catalog = getCatalog();
  const activePacks = catalog.packs
    .filter((pack) => pack.status === "active")
    .map((pack) => pack.slug);
  const activePackSet = new Set(activePacks);
  const skillPacks = new Map(
    catalog.skills.map((skill) => [
      skill.slug,
      skill.packs.filter((packSlug) => activePackSet.has(packSlug)),
    ]),
  );
  const covered = new Set<string>();

  for (const item of getBuiltWithSkillsCases("en")) {
    if (
      item.evidenceClass !== "real-use" ||
      !hasInspectableRealUseEvidence(item)
    ) {
      continue;
    }

    for (const skillSlug of item.skills) {
      for (const packSlug of skillPacks.get(skillSlug) ?? []) {
        covered.add(packSlug);
      }
    }
  }

  const coveredPackSlugs = activePacks.filter((packSlug) => covered.has(packSlug));
  const uncoveredPackSlugs = activePacks.filter((packSlug) => !covered.has(packSlug));

  return {
    coveredPackSlugs,
    uncoveredPackSlugs,
    coveredCount: coveredPackSlugs.length,
    totalActivePacks: activePacks.length,
  };
}
