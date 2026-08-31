import type { BuiltWithSkillsCase } from "./built-with-skills";
import type { LocalizedPack } from "./catalog";

export interface PackEvidenceRelation {
  readonly case: BuiltWithSkillsCase;
  readonly matchingSkillSlugs: readonly string[];
  readonly coversEntirePack: boolean;
}

export interface CasePackRelation {
  readonly pack: LocalizedPack;
  readonly matchingSkillSlugs: readonly string[];
  readonly coversEntirePack: boolean;
}

export function getCasesUsingSkill(
  cases: readonly BuiltWithSkillsCase[],
  skillSlug: string,
): readonly BuiltWithSkillsCase[] {
  return cases.filter((item) => item.skills.includes(skillSlug));
}

export function getPacksContainingSkill(
  packs: readonly LocalizedPack[],
  skillSlug: string,
): readonly LocalizedPack[] {
  return packs.filter((pack) => pack.skills.some((skill) => skill.slug === skillSlug));
}

export function getCasesUsingPackMethods(
  cases: readonly BuiltWithSkillsCase[],
  pack: LocalizedPack,
): readonly PackEvidenceRelation[] {
  const packSkillSlugs = pack.skills.map((skill) => skill.slug);

  return cases.flatMap((item) => {
    const matchingSkillSlugs = packSkillSlugs.filter((slug) => item.skills.includes(slug));
    if (!matchingSkillSlugs.length) return [];

    return [
      {
        case: item,
        matchingSkillSlugs,
        coversEntirePack:
          packSkillSlugs.length > 0 && matchingSkillSlugs.length === packSkillSlugs.length,
      },
    ];
  });
}

export function getRelatedPacksForCase(
  packs: readonly LocalizedPack[],
  item: BuiltWithSkillsCase,
): readonly CasePackRelation[] {
  return packs.flatMap((pack) => {
    const packSkillSlugs = pack.skills.map((skill) => skill.slug);
    const matchingSkillSlugs = packSkillSlugs.filter((slug) => item.skills.includes(slug));
    if (!matchingSkillSlugs.length) return [];

    return [
      {
        pack,
        matchingSkillSlugs,
        coversEntirePack:
          packSkillSlugs.length > 0 && matchingSkillSlugs.length === packSkillSlugs.length,
      },
    ];
  });
}
