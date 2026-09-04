import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import SkillDetailPage from "@/app/[locale]/skills/[slug]/page";

describe("Method Dossier", () => {
  it("renders a hybrid editorial dossier with a real technical reader", async () => {
    const { container } = render(
      await SkillDetailPage({
        params: Promise.resolve({ locale: "en", slug: "designing-ui-systems" }),
      }),
    );

    expect(container.querySelector('[data-method-dossier="hero"]')).toBeInTheDocument();
    expect(container.querySelector('[data-method-dossier="benefit"]')).toBeInTheDocument();

    const navigation = screen.getByRole("navigation", { name: "In this skill" });
    expect(navigation).toBeInTheDocument();

    for (const link of navigation.querySelectorAll("a")) {
      const href = link.getAttribute("href");
      expect(href?.startsWith("#")).toBe(true);
      expect(container.querySelector(href!)).toBeInTheDocument();
    }

    expect(container.querySelector("#when-to-use")).toBeInTheDocument();
    expect(container.querySelector("#example-prompts")).toBeInTheDocument();
    expect(container.querySelector("#installation")).toBeInTheDocument();

    const promptSpecimens = container.querySelectorAll("[data-prompt-specimen]");
    expect(promptSpecimens.length).toBeGreaterThan(0);
    promptSpecimens.forEach((specimen) => {
      expect(specimen.querySelector('[data-interaction="confirm"]')).toBeInTheDocument();
      expect(withinText(specimen)).not.toHaveLength(0);
    });
  });

  it.each([
    ["en", "Download Skill ZIP"],
    ["pt-BR", "Baixar ZIP da skill"],
  ] as const)("offers a versioned ChatGPT-ready ZIP download for %s", async (locale, label) => {
    await SkillDetailPage({
      params: Promise.resolve({ locale, slug: "designing-ui-systems" }),
    }).then((page) => render(page));

    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "href",
      "/downloads/skills/designing-ui-systems-1.0.0.zip",
    );
    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "download",
      "designing-ui-systems-1.0.0.zip",
    );
  });

  it.each([
    ["en", "Install this skill", "Inspect source", "Maturity", "Version"],
    ["pt-BR", "Instalar esta skill", "Inspecionar código-fonte", "Maturidade", "Versão"],
  ] as const)(
    "uses specific install/source actions and keeps skill maturity distinct from release version for %s",
    async (locale, installAction, sourceAction, maturityLabel, versionLabel) => {
      await SkillDetailPage({
        params: Promise.resolve({ locale, slug: "designing-ui-systems" }),
      }).then((page) => render(page));

      expect(screen.getByRole("heading", { name: installAction })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: sourceAction })).toHaveAttribute(
        "href",
        "https://github.com/jhonatan-oliveiradev/agent-skills/tree/main/skills/designing-ui-systems",
      );
      expect(maturityLabel).not.toBe(versionLabel);
      expect(screen.getByText(maturityLabel)).toBeInTheDocument();
      expect(screen.getByText(versionLabel)).toBeInTheDocument();
    },
  );

  it("presents supported environments as product names rather than compatibility slugs", async () => {
    await SkillDetailPage({
      params: Promise.resolve({ locale: "en", slug: "designing-ui-systems" }),
    }).then((page) => render(page));

    expect(screen.getByText("ChatGPT · Codex · Claude Code")).toBeInTheDocument();
    expect(screen.getByText("Filesystem")).toBeInTheDocument();
    expect(screen.queryByText("chatgpt, codex, claude-code")).not.toBeInTheDocument();
    expect(screen.queryByText("filesystem")).not.toBeInTheDocument();
  });

  it("connects a method to its canonical system and explicit evidence reports", async () => {
    const { container } = render(
      await SkillDetailPage({
        params: Promise.resolve({ locale: "en", slug: "designing-ui-systems" }),
      }),
    );

    expect(screen.getByRole("link", { name: "Frontend & Product" })).toHaveAttribute(
      "href",
      "/en/packs/frontend-product",
    );
    expect(container.querySelector("[data-method-evidence]")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catalog experience" })).toHaveAttribute(
      "href",
      "/en/built-with-skills/catalog-experience",
    );
    expect(screen.getByRole("link", { name: "Pack experience" })).toHaveAttribute(
      "href",
      "/en/built-with-skills/pack-experience",
    );
  });
});

function withinText(element: Element) {
  return element.textContent?.trim() ?? "";
}
