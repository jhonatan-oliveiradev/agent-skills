import { describe, expect, it } from "vitest";
import { homeEvidenceContent } from "./home-evidence-content";

describe("homeEvidenceContent", () => {
  it.each(["en", "pt-BR"] as const)("defines the four-state Case 001 story for %s", (locale) => {
    const copy = homeEvidenceContent[locale];

    expect(copy.caseStudy.stages).toHaveLength(4);
    expect(copy.caseStudy.stages.map((stage) => stage.id)).toEqual([
      "problem",
      "method",
      "transformation",
      "evidence",
    ]);
    expect(copy.caseStudy.evidence).toContain("PR #22");
    expect(copy.acts).toHaveLength(3);
    expect(copy.methods.featured.map((item) => item.slug)).toEqual([
      "designing-ui-systems",
      "building-premium-nextjs-interfaces",
      "craft-premium-motion",
    ]);
    expect(copy.workflow.movements).toHaveLength(4);
    expect(copy.ledger.title.length).toBeGreaterThan(0);
  });
});
