import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import AboutPage from "@/app/[locale]/about/page";

describe("About editorial manifesto and colophon", () => {
  it.each([
    ["en", "Skills are not prompts. They are working methods.", "Explore the source on GitHub"],
    ["pt-BR", "Skills não são prompts. São métodos de trabalho.", "Explorar o código no GitHub"],
  ] as const)("renders the localized authorial About architecture for %s", async (locale, thesis, sourceAction) => {
    const { container } = render(await AboutPage({ params: Promise.resolve({ locale }) }));

    expect(container.querySelector("[data-editorial-colophon]")).toBeInTheDocument();
    expect(container.querySelector("[data-manifesto-statement]")).toHaveTextContent(thesis);
    expect(container.querySelectorAll("[data-principle-chapter]")).toHaveLength(5);
    expect(container.querySelector("[data-colophon]")).toBeInTheDocument();
    expect(container.querySelector(".project-page")).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: sourceAction })).toHaveAttribute(
      "data-interaction",
      "navigate",
    );
  });
});
