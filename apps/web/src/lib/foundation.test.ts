// @vitest-environment node

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { syncCatalog } from "../../scripts/sync-catalog.mjs";

const webRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

function getRule(css: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Missing CSS rule: ${selector}`);
  return match[1];
}

function getCustomProperty(rules: string[], property: string): string {
  const expression = new RegExp(
    `${property}:\\s*(#[0-9a-fA-F]{6}|var\\((--[^)]+)\\))`,
  );
  const match = [...rules]
    .reverse()
    .map((rule) => rule.match(expression))
    .find((value) => value !== null);
  if (!match) throw new Error(`Missing color custom property: ${property}`);
  return match[2] ? getCustomProperty(rules, match[2]) : match[1];
}

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);
  if (!channels || channels.length !== 3) throw new Error(`Invalid color: ${hex}`);

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string): number {
  const light = Math.max(relativeLuminance(first), relativeLuminance(second));
  const dark = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (light + 0.05) / (dark + 0.05);
}

describe("web package contract", () => {
  it("pins the application runtime and exposes every required gate", () => {
    const pkg = JSON.parse(readFileSync(resolve(webRoot, "package.json"), "utf8"));

    expect(pkg.private).toBe(true);
    expect(pkg.engines.node).toBe(">=20");
    expect(Object.keys(pkg.scripts)).toEqual(
      expect.arrayContaining(["dev", "build", "start", "lint", "typecheck", "test"]),
    );
    expect(pkg.dependencies.next).toBe("16.3.1");
    expect(pkg.dependencies.react).toBe("19.2.8");
    expect(pkg.dependencies["react-dom"]).toBe("19.2.8");
  });

  it("prepares generated Skill and Pack ZIPs, the catalog, and route types before consuming gates", () => {
    const pkg = JSON.parse(readFileSync(resolve(webRoot, "package.json"), "utf8"));

    expect(pkg.scripts.pretest).toBe("node scripts/sync-catalog.mjs");
    expect(pkg.scripts.pretypecheck).toBe(
      "node scripts/sync-catalog.mjs && next typegen",
    );
    expect(pkg.scripts.typecheck).toBe("tsc --noEmit");
    expect(pkg.scripts.prebuild).toBe(
      "node ../../scripts/generate-skill-zips.mjs && node ../../scripts/generate-pack-zips.mjs && node scripts/sync-catalog.mjs",
    );
  });

  it("gives bordered controls at least 3:1 contrast in light and dark themes", () => {
    const css = readFileSync(resolve(webRoot, "src/app/globals.css"), "utf8");
    const lightTheme = getRule(css, ":root");
    const darkTheme = getRule(css, ".dark");

    for (const theme of [[lightTheme], [lightTheme, darkTheme]]) {
      expect(
        contrastRatio(
          getCustomProperty(theme, "--control-border"),
          getCustomProperty(theme, "--surface"),
        ),
      ).toBeGreaterThanOrEqual(3);
    }

    for (const selector of [
      ".site-controls select,\n.locale-switcher",
      ".button",
      ".skip-link",
    ]) {
      expect(getRule(css, selector)).toMatch(/border[^;]*var\(--control-border\)/);
    }
  });

  it("preserves the prior generated catalog when the root catalog is invalid", () => {
    const repoRoot = mkdtempSync(resolve(tmpdir(), "catalog-sync-"));
    const webRoot = resolve(repoRoot, "apps/web");
    const destination = resolve(webRoot, "src/generated/catalog.json");
    const previousBytes = "previous generated catalog\n";

    try {
      mkdirSync(resolve(repoRoot, "catalog/generated"), { recursive: true });
      mkdirSync(resolve(webRoot, "src/generated"), { recursive: true });
      writeFileSync(resolve(repoRoot, "VERSION"), "1.0.0\n");
      writeFileSync(
        resolve(repoRoot, "catalog/generated/catalog.json"),
        JSON.stringify({
          version: "1.0.0",
          locales: ["en", "fr"],
          skills: Array.from({ length: 18 }),
          packs: Array.from({ length: 6 }),
        }),
      );
      writeFileSync(destination, previousBytes);

      expect(() => syncCatalog({ repoRoot, webRoot, runValidation: false })).toThrow(
        "Catalog locales must equal en, pt-BR",
      );
      expect(readFileSync(destination, "utf8")).toBe(previousBytes);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
