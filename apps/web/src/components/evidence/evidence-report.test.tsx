import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import BuiltWithSkillsDetailPage from "@/app/[locale]/built-with-skills/[slug]/page";

describe("Evidence Report", () => {
  it("organizes a case as problem, methods, verification, and result", async () => {
    const { container } = render(
      await BuiltWithSkillsDetailPage({
        params: Promise.resolve({ locale: "en", slug: "catalog-experience" }),
      }),
    );

    expect(container.querySelector("[data-evidence-report]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Catalog experience" })).toBeInTheDocument();

    const problem = container.querySelector<HTMLElement>("#problem");
    const methods = container.querySelector<HTMLElement>("#methods");
    const verification = container.querySelector<HTMLElement>("#verification");
    const result = container.querySelector<HTMLElement>("#result");

    expect(problem).toBeInTheDocument();
    expect(methods).toBeInTheDocument();
    expect(verification).toBeInTheDocument();
    expect(result).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Problem" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Methods applied" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Verification" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Result" })).toBeInTheDocument();

    expect(methods!.querySelector("[data-evidence-decision-record]")).toBeInTheDocument();
    expect(within(methods!).getByRole("link", { name: "Designing UI Systems" })).toHaveAttribute(
      "href",
      "/en/skills/designing-ui-systems",
    );
    expect(within(verification!).getByRole("link", { name: "Source record" })).toHaveAttribute(
      "href",
      "https://github.com/jhonatan-oliveiradev/agent-skills/blob/main/docs/built-with-skills/2026-08-28-catalog-experience.md",
    );
    expect(screen.getByText("Internal evidence")).toBeInTheDocument();
    expect(container.querySelector(".built-case-detail__evidence")).not.toBeInTheDocument();

    expect(problem!.compareDocumentPosition(methods!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(methods!.compareDocumentPosition(verification!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(verification!.compareDocumentPosition(result!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it.each([
    [
      "en",
      "Treat this report as evidence for the methods and verification shown here. Related-pack overlap alone is not proof that a pack was used or fully validated.",
    ],
    [
      "pt-BR",
      "Trate este relatório como evidência dos métodos e da verificação mostrados aqui. A sobreposição com um pack, sozinha, não prova que o pack foi usado ou validado por completo.",
    ],
  ] as const)("states the evidence scope without strengthening the claim for %s", async (locale, note) => {
    const { container } = render(
      await BuiltWithSkillsDetailPage({
        params: Promise.resolve({ locale, slug: "catalog-experience" }),
      }),
    );

    expect(container.querySelector("[data-evidence-scope-note]")).toBeInTheDocument();
    expect(screen.getByText(note)).toBeInTheDocument();
  });

  it("renders localized evidence provenance for pt-BR", async () => {
    render(
      await BuiltWithSkillsDetailPage({
        params: Promise.resolve({ locale: "pt-BR", slug: "catalog-experience" }),
      }),
    );

    expect(screen.getByText("Evidência interna")).toBeInTheDocument();
  });

  it("connects explicit methods back to related systems without asserting pack usage", async () => {
    const { container } = render(
      await BuiltWithSkillsDetailPage({
        params: Promise.resolve({ locale: "en", slug: "catalog-experience" }),
      }),
    );

    expect(container.querySelector("[data-related-systems]")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Frontend & Product" })).toHaveAttribute(
      "href",
      "/en/packs/frontend-product",
    );
    expect(screen.getByText("3 / 8 methods represented")).toBeInTheDocument();
    expect(screen.getByText("Method overlap only — not proof that the pack was used as a unit.")).toBeInTheDocument();
  });
});
