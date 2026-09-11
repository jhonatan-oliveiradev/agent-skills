import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles/career-assessments.css"), "utf8");

describe("Career Lab assessment learning UI", () => {
  it("provides semantic success/error states and a concealed answer-reveal surface", () => {
    expect(css).toMatch(/--career-assessment-success:/);
    expect(css).toMatch(/--career-assessment-danger:/);
    expect(css).toMatch(/\[data-feedback="correct"\]/);
    expect(css).toMatch(/\[data-feedback="incorrect"\]/);
    expect(css).toMatch(/\[data-answer-state="correct"\]/);
    expect(css).toMatch(/\[data-answer-state="incorrect"\]/);
    expect(css).toMatch(/\.career-assessment-feedback__veil/);
    expect(css).toMatch(/\.career-assessment-feedback__reveal/);
  });
});
