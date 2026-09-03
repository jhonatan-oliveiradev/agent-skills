import "server-only";
import { getCatalog, getLocalizedPacks } from "./catalog";
import type { Locale } from "./locales";
import { messages } from "./messages";
import { getRealUsePackCoverage } from "./real-use-pack-coverage";

export type RoadmapStageId =
  | "proposal"
  | "research"
  | "development"
  | "experimental"
  | "beta"
  | "stable"
  | "deprecated";

export interface RoadmapItem {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly meta: string;
  readonly href?: string;
}

export interface RoadmapStage {
  readonly id: RoadmapStageId;
  readonly title: string;
  readonly description: string;
  readonly empty: string;
  readonly items: readonly RoadmapItem[];
}

const realUseEvidenceCopy: Readonly<Record<Locale, { readonly summary: string; readonly meta: string }>> = {
  en: {
    summary: "Real-use evidence currently represents {covered} of {total} active packs.",
    meta: "{covered}/{total} packs with real-use evidence",
  },
  "pt-BR": {
    summary: "Evidências de uso real representam atualmente {covered} de {total} pacotes ativos.",
    meta: "{covered}/{total} pacotes com evidência de uso real",
  },
};

function applyCoverage(template: string, covered: number, total: number): string {
  return template
    .replace("{covered}", String(covered))
    .replace("{total}", String(total));
}

export function getRoadmapStages(locale: Locale): readonly RoadmapStage[] {
  const catalog = getCatalog();
  const copy = messages[locale].roadmap;
  const evidenceCopy = realUseEvidenceCopy[locale];
  const realUseCoverage = getRealUsePackCoverage();
  const stableCount = catalog.skills.filter((skill) => skill.maturity === "stable").length;
  const proposed = getLocalizedPacks(locale)
    .filter((pack) => pack.status === "planned")
    .map((pack) => ({
      id: pack.slug,
      title: pack.name,
      summary: pack.summary,
      meta: copy.itemMeta.plannedPack,
      href: `/${locale}/packs/${pack.slug}`,
    }));
  const stableSurfaces = copy.stableSurfaceItems.map((item) => ({
    ...item,
    meta: catalog.version,
  }));
  const stable = [
    ...stableSurfaces,
    {
      id: "stable-skills",
      title: copy.stableItem.title,
      summary: `${copy.stableItem.summary.replace("{count}", String(stableCount))} ${applyCoverage(evidenceCopy.summary, realUseCoverage.coveredCount, realUseCoverage.totalActivePacks)}`,
      meta: `${copy.itemMeta.stableSkills.replace("{count}", String(stableCount))} · ${applyCoverage(evidenceCopy.meta, realUseCoverage.coveredCount, realUseCoverage.totalActivePacks)}`,
      href: `/${locale}/skills`,
    },
  ];
  const items: Readonly<Record<RoadmapStageId, readonly RoadmapItem[]>> = {
    proposal: proposed,
    research: [],
    development: [],
    experimental: [],
    beta: [],
    stable,
    deprecated: [],
  };

  return copy.stages.map((stage) => ({ ...stage, items: items[stage.id] }));
}
