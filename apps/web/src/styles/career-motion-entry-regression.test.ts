import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readInteractions(): string {
  return readFileSync(resolve(process.cwd(), "src/styles/career-interactions.css"), "utf8");
}

describe("Career Lab disclosure entry motion", () => {
  it("keeps details content visible during opening while deferring hiding until close completes", () => {
    const css = readInteractions();

    expect(css).toMatch(/content-visibility\s+var\(--career-motion-base\)\s+allow-discrete/);
    expect(css).not.toMatch(/content-visibility[^;\n]*step-end/);
    expect(css).toMatch(/\.career-guide__qa details\[open\]::details-content/);
    expect(css).toMatch(/\.career-roadmap-details\[open\]::details-content/);
  });
});
