import { describe, expect, it } from "vitest";
import { homeManifesto } from "./home-content";
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

  it("defines the Home for an unfamiliar agent user before builder depth", () => {
    const copy = homeManifesto.en;

    expect(copy.titleLead).toBe("Skills are not prompts.");
    expect(copy.titleClose).toBe("They are working methods.");
    expect(copy.summary).toContain("installable");
    expect(copy.summary).toContain("inspectable");
    expect(copy.summary).toContain("working methods");
    expect(copy.primaryAction).toBe("Explore skills");
    expect(copy.secondaryAction).toBe("Inspect real-use evidence");
    expect(copy.secondaryHref).toBe("/built-with-skills");
    expect(copy.engine.stages).toEqual(["Request", "Method", "Evidence"]);
    expect(copy.engine.prompt).not.toMatch(/premium/i);
  });

  it("gives PT-BR the same product contract in native language", () => {
    const copy = homeManifesto["pt-BR"];

    expect(copy.titleLead).toBe("Skills não são prompts.");
    expect(copy.titleClose).toBe("São métodos de trabalho.");
    expect(copy.summary).toContain("instalável");
    expect(copy.summary).toContain("inspecionável");
    expect(copy.summary).toContain("métodos de trabalho");
    expect(copy.primaryAction).toBe("Explorar skills");
    expect(copy.secondaryAction).toBe("Inspecionar evidências reais");
    expect(copy.secondaryHref).toBe("/built-with-skills");
    expect(copy.engine.stages).toEqual(["Pedido", "Método", "Evidência"]);
    expect(copy.engine.prompt).not.toMatch(/premium/i);
  });
});