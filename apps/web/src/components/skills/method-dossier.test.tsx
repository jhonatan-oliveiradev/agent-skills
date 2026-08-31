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

    const navigation = screen.getByRole("navigation", { name: "On this method" });
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
});

function withinText(element: Element) {
  return element.textContent?.trim() ?? "";
}
