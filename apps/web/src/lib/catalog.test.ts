import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import * as catalogAdapter from "./catalog";

const { getCatalog, getCatalogCounts, getSupportedLocales } = catalogAdapter;

describe("catalog adapter", () => {
  it("exposes the complete committed catalog without redefining facts", () => {
    const catalog = getCatalog();
    const source = JSON.parse(
      readFileSync(resolve(process.cwd(), "../../catalog/generated/catalog.json"), "utf8"),
    );

    expect(catalog.sourceDigest).toBe(source.sourceDigest);
    expect(catalog.skills).toHaveLength(18);
    expect(catalog.packs).toHaveLength(6);
    expect(getCatalogCounts()).toEqual(source.counts);
    expect(getSupportedLocales()).toEqual(["en", "pt-BR"]);
  });

  it("returns one frozen catalog instance", () => {
    expect(getCatalog()).toBe(getCatalog());
    expect(Object.isFrozen(getCatalog())).toBe(true);
  });

  it("resolves complete localized detail data by slug", () => {
    const adapter = catalogAdapter as typeof catalogAdapter & {
      getLocalizedSkillBySlug?: (locale: "en" | "pt-BR", slug: string) => {
        displayName: string;
        whenToUse: string;
        useCases: readonly string[];
        relatedSkills: readonly { slug: string; displayName: string }[];
      } | undefined;
    };

    expect(adapter.getLocalizedSkillBySlug).toBeTypeOf("function");
    const skill = adapter.getLocalizedSkillBySlug?.(
      "pt-BR",
      "auditing-pixel-perfect-frontend",
    );

    expect(skill?.displayName).toBe("Auditoria de Frontend Pixel-Perfect");
    expect(skill?.whenToUse).toContain("Figma");
    expect(skill?.useCases).toHaveLength(2);
    expect(skill?.relatedSkills).toEqual([
      {
        slug: "implementing-reference-faithful-ui",
        displayName: "Implementação de UI Fiel à Referência",
      },
    ]);
    expect(adapter.getLocalizedSkillBySlug?.("en", "missing-skill")).toBeUndefined();
  });

  it("derives selective installation commands from the canonical slug", () => {
    const adapter = catalogAdapter as typeof catalogAdapter & {
      getSkillInstallCommands?: (slug: string) => { bash: string; powershell: string };
    };

    expect(adapter.getSkillInstallCommands).toBeTypeOf("function");
    expect(adapter.getSkillInstallCommands?.("craft-premium-motion")).toEqual({
      bash: "./install.sh --skill craft-premium-motion",
      powershell: "./install.ps1 --skill craft-premium-motion",
    });
  });
});
