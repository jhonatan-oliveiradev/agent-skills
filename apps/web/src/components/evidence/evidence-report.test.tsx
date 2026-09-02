import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import BuiltWithSkillsDetailPage from "@/app/[locale]/built-with-skills/[slug]/page";

describe("Evidence Report", () => {
  it("renders the catalog case as five inspectable narrative acts", async () => {
    const { container } = render(
      await BuiltWithSkillsDetailPage({
        params: Promise.resolve({ locale: "en", slug: "catalog-experience" }),
      }),
    );

    expect(container.querySelector("[data-evidence-report]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Catalog experience" })).toBeInTheDocument();
    expect(container.querySelector("#challenge")).toBeInTheDocument();
    expect(container.querySelector("#methods")).toBeInTheDocument();
    expect(container.querySelector("#decisions")).toBeInTheDocument();
    expect(container.querySelector("#outcomes")).toBeInTheDocument();
    expect(container.querySelector("#evidence")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Designing UI Systems" })).toHaveAttribute(
      "href",
      "/en/skills/designing-ui-systems",
    );
    expect(screen.getByText("Internal evidence")).toBeInTheDocument();
    expect(screen.getAllByText("SOURCE / AVAILABLE")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Source record" })).toHaveAttribute(
      "href",
      "https://github.com/jhonatan-oliveiradev/agent-skills/blob/main/docs/built-with-skills/2026-08-28-catalog-experience.md",
    );
    expect(container.querySelector(".built-case-detail__evidence")).not.toBeInTheDocument();
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
