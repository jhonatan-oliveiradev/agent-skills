import "server-only";
import generatedCatalog from "@/generated/catalog.json";
import type { Locale } from "./locales";

export interface Catalog {
  readonly schemaVersion: string;
  readonly version: string;
  readonly defaultLocale: Locale;
  readonly locales: readonly Locale[];
  readonly sourceDigest: string;
  readonly counts: Readonly<Record<string, unknown>>;
  readonly skills: readonly Readonly<Record<string, unknown>>[];
  readonly packs: readonly Readonly<Record<string, unknown>>[];
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
