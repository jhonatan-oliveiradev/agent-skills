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
    expect(homeManifesto.en.titleLead).toBe("Skills are not prompts.");
    expect(homeManifesto.en.titleClose).toBe("They are working methods.");
    expect(homeManifesto.en.summary).toBe(
      "A curated, installable collection of working methods that gives agents a clearer way to investigate, decide, build, and verify real work.",
    );
    expect(homeManifesto.en.primaryAction).toBe("Explore skills");
    expect(homeManifesto.en.secondaryAction).toBe("Inspect real-use evidence");
    expect(homeManifesto.en.secondaryHref).toBe("/built-with-skills");
    expect(homeManifesto.en.engine.prompt).not.toMatch(/premium/i);
  });

  it("gives PT-BR the same product contract in native language", () => {
    expect(homeManifesto["pt-BR"].titleLead).toBe("Skills não são prompts.");
    expect(homeManifesto["pt-BR"].titleClose).toBe("São métodos de trabalho.");
    expect(homeManifesto["pt-BR"].summary).toBe(
      "Uma coleção curada e instalável de métodos de trabalho que dá aos agentes um caminho mais claro para investigar, decidir, construir e verificar trabalho real.",
    );
    expect(homeManifesto["pt-BR"].primaryAction).toBe("Explorar skills");
    expect(homeManifesto["pt-BR"].secondaryAction).toBe("Inspecionar evidências reais");
    expect(homeManifesto["pt-BR"].secondaryHref).toBe("/built-with-skills");
    expect(homeManifesto["pt-BR"].engine.prompt).not.toMatch(/premium/i);
  });
});