import { describe, expect, it } from "vitest";
import { homeEvidenceContent } from "./home-evidence-content";

describe("homeEvidenceContent", () => {
  it.each(["en", "pt-BR"] as const)("defines the evidence-first Home contract for %s", (locale) => {
    const copy = homeEvidenceContent[locale];

    expect(copy.proof.eyebrow.length).toBeGreaterThan(0);
    expect(copy.proof.evidence.length).toBeGreaterThanOrEqual(3);
    expect(copy.transformation.stages).toHaveLength(3);
    expect(copy.methods.featured.map((item) => item.slug)).toEqual([
      "designing-ui-systems",
      "building-premium-nextjs-interfaces",
      "craft-premium-motion",
    ]);
    expect(copy.workflow.movements).toHaveLength(4);
    expect(copy.ledger.title.length).toBeGreaterThan(0);
  });
});
