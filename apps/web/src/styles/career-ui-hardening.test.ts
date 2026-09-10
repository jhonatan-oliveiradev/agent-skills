import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readWebFile(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

function readStyle(name: string): string {
  return readWebFile(resolve("src/styles", name));
}

describe("Career Lab UI hardening styles", () => {
  it("loads the assessment visual system on the dynamic assessment route", () => {
    const page = readWebFile("src/app/[locale]/(career)/career-lab/assessments/[id]/page.tsx");

    expect(page).toContain('import "@/styles/career-assessments.css";');
  });

  it("provides a complete visual contract for assessment runner and result surfaces", () => {
    const css = readStyle("career-assessments.css");

    expect(css).toMatch(/\.career-assessment-runner\s*\{/);
    expect(css).toMatch(/\.career-assessment-runner__header\s*\{/);
    expect(css).toMatch(/\.career-assessment-runner__option\[data-selected="true"\]/);
    expect(css).toMatch(/\.career-assessment-runner__actions\s*\{/);
    expect(css).toMatch(/\.career-assessment-result__summary\s*\{/);
    expect(css).toMatch(/\.career-assessment-result__section\s*\{/);
  });

  it("adds interpolated FAQ disclosure motion instead of an abrupt details toggle", () => {
    const css = readStyle("career-guidance.css");

    expect(css).toMatch(/\.career-guide__answer\s*\{/);
    expect(css).toMatch(/grid-template-rows:\s*0fr/);
    expect(css).toMatch(/details\[open\][\s\S]*grid-template-rows:\s*1fr/);
    expect(css).toMatch(/\.career-guide__answer-inner\s*\{/);
    expect(css).toMatch(/transition:/);
  });

  it("defines scoped Career Lab motion tokens and retains reduced-motion protection", () => {
    const lab = readStyle("career-lab.css");
    const convergence = readStyle("career-convergence.css");

    expect(lab).toMatch(/--career-motion-fast:/);
    expect(lab).toMatch(/--career-motion-base:/);
    expect(lab).toMatch(/--career-ease:/);
    expect(convergence).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(convergence).toMatch(/transition-duration:\s*0\.01ms/);
  });
});
