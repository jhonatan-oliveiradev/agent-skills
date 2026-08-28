import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getCatalog, getCatalogCounts, getSupportedLocales } from "./catalog";

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
});
