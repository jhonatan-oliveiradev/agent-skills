import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getBuiltWithSkillsCases } from "./built-with-skills";
import { getLocalizedPacks } from "./catalog";
import {
  getCasesUsingPackMethods,
  getCasesUsingSkill,
  getPacksContainingSkill,
  getRelatedPacksForCase,
} from "./cross-domain-relations";

describe("cross-domain relations", () => {
  const cases = getBuiltWithSkillsCases("en");
  const packs = getLocalizedPacks("en");

  it("finds evidence reports that explicitly use a method", () => {
    expect(getCasesUsingSkill(cases, "designing-ui-systems").map((item) => item.slug)).toEqual([
      "catalog-experience",
      "pack-experience",
    ]);
  });

  it("finds packs that canonically contain a method", () => {
    expect(getPacksContainingSkill(packs, "designing-ui-systems").map((pack) => pack.slug)).toEqual([
      "frontend-product",
    ]);
  });

  it("describes evidence overlap with a pack without claiming the pack itself was used", () => {
    const frontend = packs.find((pack) => pack.slug === "frontend-product")!;
    const relations = getCasesUsingPackMethods(cases, frontend);

    expect(relations).toHaveLength(4);

    const pingRelation = relations.find(
      (relation) => relation.case.slug === "ping-space-voice-membership-authorization",
    );
    expect(pingRelation).toMatchObject({
      case: { slug: "ping-space-voice-membership-authorization" },
      matchingSkillSlugs: ["shipping-github-vercel-changes"],
      coversEntirePack: false,
    });

    const portfolioRelation = relations.find(
      (relation) => relation.case.slug === "portfolio-translation-hardening",
    );
    expect(portfolioRelation).toMatchObject({
      case: { slug: "portfolio-translation-hardening" },
      matchingSkillSlugs: ["shipping-github-vercel-changes"],
      coversEntirePack: false,
    });

    const catalogRelation = relations.find(
      (relation) => relation.case.slug === "catalog-experience",
    );
    expect(catalogRelation).toMatchObject({
      case: { slug: "catalog-experience" },
      matchingSkillSlugs: [
        "designing-ui-systems",
        "building-premium-nextjs-interfaces",
        "building-conversion-product-pages",
      ],
      coversEntirePack: false,
    });
  });

  it("derives related systems for an evidence report from method overlap", () => {
    const catalogCase = cases.find((item) => item.slug === "catalog-experience")!;
    const relations = getRelatedPacksForCase(packs, catalogCase);

    expect(relations.map((relation) => relation.pack.slug)).toEqual(["frontend-product"]);
    expect(relations[0]?.matchingSkillSlugs).toHaveLength(3);
    expect(relations[0]?.coversEntirePack).toBe(false);
  });
});
