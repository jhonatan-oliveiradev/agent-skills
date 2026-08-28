import "server-only";
import { getCatalog, getLocalizedPacks } from "./catalog";
import type { Locale } from "./locales";
import { messages } from "./messages";

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

export function getRoadmapStages(locale: Locale): readonly RoadmapStage[] {
  const catalog = getCatalog();
  const copy = messages[locale].roadmap;
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
  const beta = copy.betaItems.map((item) => ({
    ...item,
    meta: catalog.version,
  }));
  const stable = [{
    id: "stable-skills",
    title: copy.stableItem.title,
    summary: copy.stableItem.summary,
    meta: copy.itemMeta.stableSkills.replace("{count}", String(stableCount)),
    href: `/${locale}/skills`,
  }];
  const items: Readonly<Record<RoadmapStageId, readonly RoadmapItem[]>> = {
    proposal: proposed,
    research: [],
    development: [],
    experimental: [],
    beta,
    stable,
    deprecated: [],
  };

  return copy.stages.map((stage) => ({ ...stage, items: items[stage.id] }));
}
