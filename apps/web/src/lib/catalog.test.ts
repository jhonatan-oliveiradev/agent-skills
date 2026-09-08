import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import * as catalogAdapter from "./catalog";

const { getCatalog, getCatalogCounts, getSupportedLocales } = catalogAdapter;
const remote = "curl -fsSL https://skills.jhonatanoliveira.com/install | bash -s --";

describe("catalog adapter", () => {
  it("exposes the complete committed catalog without redefining facts", () => {
    const catalog = getCatalog();
    const source = JSON.parse(
      readFileSync(resolve(process.cwd(), "../../catalog/generated/catalog.json"), "utf8"),
    );

    expect(catalog.sourceDigest).toBe(source.sourceDigest);
    expect(catalog.skills).toHaveLength(60);
    expect(catalog.packs).toHaveLength(12);
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
      bash: `${remote} --skill craft-premium-motion`,
      powershell: "./install.ps1 --skill craft-premium-motion",
    });
  });

  it("resolves all localized packs as active systems", () => {
    const adapter = catalogAdapter as typeof catalogAdapter & {
      getLocalizedPacks?: (locale: "en" | "pt-BR") => readonly {
        slug: string;
        name: string;
        status: "active" | "planned";
        skills: readonly { slug: string; displayName: string }[];
      }[];
      getLocalizedPackBySlug?: (
        locale: "en" | "pt-BR",
        slug: string,
      ) => { name: string; description: string; outcomes: readonly string[] } | undefined;
    };

    expect(adapter.getLocalizedPacks).toBeTypeOf("function");
    const packs = adapter.getLocalizedPacks?.("pt-BR") ?? [];
    expect(packs).toHaveLength(12);
    expect(packs.every((pack) => pack.status === "active")).toBe(true);
    expect(packs.find((pack) => pack.slug === "frontend-product")).toMatchObject({ name: "Frontend e Produto", status: "active" });
    expect(packs.find((pack) => pack.slug === "backend-data")).toMatchObject({ name: "Backend e Dados", status: "active" });
    expect(packs.find((pack) => pack.slug === "backend-data")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "architecture-engineering")).toMatchObject({ name: "Arquitetura e Engenharia", status: "active" });
    expect(packs.find((pack) => pack.slug === "architecture-engineering")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "quality-testing")).toMatchObject({ name: "Qualidade e Testes", status: "active" });
    expect(packs.find((pack) => pack.slug === "quality-testing")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "application-security")).toMatchObject({ name: "Segurança de Aplicações", status: "active" });
    expect(packs.find((pack) => pack.slug === "application-security")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "engineering-workflow")).toMatchObject({ name: "Fluxo de Engenharia", status: "active" });
    expect(packs.find((pack) => pack.slug === "engineering-workflow")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "design-brand")).toMatchObject({ name: "Design & Marca", status: "active" });
    expect(packs.find((pack) => pack.slug === "design-brand")?.skills).toHaveLength(5);
    expect(packs.find((pack) => pack.slug === "writing-communication")).toMatchObject({ name: "Escrita & Comunicação", status: "active" });
    expect(packs.find((pack) => pack.slug === "writing-communication")?.skills).toHaveLength(5);
    expect(packs.find((pack) => pack.slug === "codebase-intelligence")).toMatchObject({ name: "Inteligência de Codebase", status: "active" });
    expect(packs.find((pack) => pack.slug === "codebase-intelligence")?.skills).toHaveLength(5);

    expect(adapter.getLocalizedPackBySlug?.("en", "motion")?.outcomes).toHaveLength(2);
    expect(adapter.getLocalizedPackBySlug?.("en", "writing-communication")?.outcomes).toHaveLength(3);
    expect(adapter.getLocalizedPackBySlug?.("en", "missing-pack")).toBeUndefined();
  });

  it("derives pack installation commands only for active packs", () => {
    const adapter = catalogAdapter as typeof catalogAdapter & {
      getPackInstallCommands?: (slug: string, status: "active" | "planned") =>
        | { bash: string; powershell: string }
        | undefined;
    };

    expect(adapter.getPackInstallCommands).toBeTypeOf("function");
    for (const slug of [
      "motion",
      "backend-data",
      "architecture-engineering",
      "quality-testing",
      "application-security",
      "engineering-workflow",
      "design-brand",
      "writing-communication",
      "codebase-intelligence",
    ]) {
      expect(adapter.getPackInstallCommands?.(slug, "active")).toEqual({
        bash: `${remote} --pack ${slug}`,
        powershell: `./install.ps1 --pack ${slug}`,
      });
    }
    expect(adapter.getPackInstallCommands?.("quality-testing", "planned")).toBeUndefined();
  });
});
