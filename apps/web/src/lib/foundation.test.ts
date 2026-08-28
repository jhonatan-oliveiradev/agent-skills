// @vitest-environment node

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { syncCatalog } from "../../scripts/sync-catalog.mjs";

const webRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

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
