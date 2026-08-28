import "server-only";
import generatedCatalog from "@/generated/catalog.json";
import type { Locale } from "./locales";
import type { SkillCatalogItem } from "./skill-filters";

interface CatalogSkillLocale {
  readonly displayName: string;
  readonly summary: string;
  readonly primaryBenefit: string;
}

interface CatalogSkill {
  readonly slug: string;
  readonly category: string;
  readonly packs: readonly string[];
  readonly maturity: string;
  readonly difficulty: string;
  readonly tags: readonly string[];
  readonly locales: Readonly<Record<Locale, CatalogSkillLocale>>;
}

interface CatalogPack {
  readonly slug: string;
  readonly locales: Readonly<Record<Locale, { readonly name: string }>>;
}

export interface Catalog {
  readonly schemaVersion: string;
  readonly version: string;
  readonly defaultLocale: Locale;
  readonly locales: readonly Locale[];
  readonly sourceDigest: string;
  readonly filters: Readonly<{
    readonly categories: readonly string[];
    readonly packs: readonly string[];
    readonly difficulty: readonly string[];
    readonly maturity: readonly string[];
  }>;
  readonly counts: Readonly<Record<string, unknown>>;
  readonly skills: readonly CatalogSkill[];
  readonly packs: readonly CatalogPack[];
}

const catalog = Object.freeze(generatedCatalog) as unknown as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getCatalogCounts(): Catalog["counts"] {
  return catalog.counts;
}

export function getSupportedLocales(): readonly Locale[] {
  return catalog.locales;
}

export function getLocalizedSkills(locale: Locale): readonly SkillCatalogItem[] {
  return catalog.skills.map((skill) => ({
    slug: skill.slug,
    category: skill.category,
    packs: skill.packs,
    maturity: skill.maturity,
    difficulty: skill.difficulty,
    tags: skill.tags,
    displayName: skill.locales[locale].displayName,
    summary: skill.locales[locale].summary,
    primaryBenefit: skill.locales[locale].primaryBenefit,
  }));
}

export function getLocalizedPackNames(locale: Locale): Readonly<Record<string, string>> {
  return Object.fromEntries(catalog.packs.map((pack) => [pack.slug, pack.locales[locale].name]));
}
