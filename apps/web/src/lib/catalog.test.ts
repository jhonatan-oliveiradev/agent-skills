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
    expect(catalog.skills).toHaveLength(49);
    expect(catalog.packs).toHaveLength(10);
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
    expect(packs).toHaveLength(10);
    expect(packs.every((pack) => pack.status === "active")).toBe(true);
    expect(packs.find((pack) => pack.slug === "frontend-product")).toMatchObject({
      name: "Frontend e Produto",
      status: "active",
    });
    expect(packs.find((pack) => pack.slug === "backend-data")).toMatchObject({
      name: "Backend e Dados",
      status: "active",
    });
    expect(packs.find((pack) => pack.slug === "backend-data")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "architecture-engineering")).toMatchObject({
      name: "Arquitetura e Engenharia",
      status: "active",
    });
    expect(packs.find((pack) => pack.slug === "architecture-engineering")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "quality-testing")).toMatchObject({
      name: "Qualidade e Testes",
      status: "active",
    });
    expect(packs.find((pack) => pack.slug === "quality-testing")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "application-security")).toMatchObject({
      name: "Segurança de Aplicações",
      status: "active",
    });
    expect(packs.find((pack) => pack.slug === "application-security")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "engineering-workflow")).toMatchObject({
      name: "Fluxo de Engenharia",
      status: "active",
    });
    expect(packs.find((pack) => pack.slug === "engineering-workflow")?.skills).toHaveLength(4);
    expect(packs.find((pack) => pack.slug === "design-brand")).toMatchObject({
      name: "Design & Marca",
      status: "active",
    });
    expect(packs.find((pack) => pack.slug === "design-brand")?.skills).toHaveLength(5);
    expect(packs.find((pack) => pack.slug === "writing-communication")).toMatchObject({
      name: "Escrita & Comunicação",
      status: "active",
    });
    expect(packs.find((pack) => pack.slug === "writing-communication")?.skills).toHaveLength(5);

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
    expect(adapter.getPackInstallCommands?.("motion", "active")).toEqual({
      bash: "./install.sh --pack motion",
      powershell: "./install.ps1 --pack motion",
    });
    expect(adapter.getPackInstallCommands?.("backend-data", "active")).toEqual({
      bash: "./install.sh --pack backend-data",
      powershell: "./install.ps1 --pack backend-data",
    });
    expect(adapter.getPackInstallCommands?.("architecture-engineering", "active")).toEqual({
      bash: "./install.sh --pack architecture-engineering",
      powershell: "./install.ps1 --pack architecture-engineering",
    });
    expect(adapter.getPackInstallCommands?.("quality-testing", "active")).toEqual({
      bash: "./install.sh --pack quality-testing",
      powershell: "./install.ps1 --pack quality-testing",
    });
    expect(adapter.getPackInstallCommands?.("application-security", "active")).toEqual({
      bash: "./install.sh --pack application-security",
      powershell: "./install.ps1 --pack application-security",
    });
    expect(adapter.getPackInstallCommands?.("engineering-workflow", "active")).toEqual({
      bash: "./install.sh --pack engineering-workflow",
      powershell: "./install.ps1 --pack engineering-workflow",
    });
    expect(adapter.getPackInstallCommands?.("design-brand", "active")).toEqual({
      bash: "./install.sh --pack design-brand",
      powershell: "./install.ps1 --pack design-brand",
    });
    expect(adapter.getPackInstallCommands?.("writing-communication", "active")).toEqual({
      bash: "./install.sh --pack writing-communication",
      powershell: "./install.ps1 --pack writing-communication",
    });
    expect(adapter.getPackInstallCommands?.("quality-testing", "planned")).toBeUndefined();
  });
});
