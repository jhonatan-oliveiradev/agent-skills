import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import PackDetailPage from "@/app/[locale]/packs/[slug]/page";

describe("System Blueprint", () => {
  it("renders an active pack as an installable editorial blueprint", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "frontend-product" }),
      }),
    );

    expect(container.querySelector('[data-pack-blueprint="hero"]')).toBeInTheDocument();
    expect(container.querySelectorAll("[data-pack-outcome]").length).toBeGreaterThan(0);
    expect(container.querySelector("[data-pack-composition-map]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Install this pack" })).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack frontend-product")).toBeInTheDocument();
  });

  it("renders Backend & Data as a real four-method installable system", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "backend-data" }),
      }),
    );

    expect(container.querySelector('[data-pack-state="active"]')).toBeInTheDocument();
    const composition = container.querySelector<HTMLElement>("[data-pack-composition-map]");
    expect(composition).toBeInTheDocument();
    expect(within(composition!).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Install this pack" })).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack backend-data")).toBeInTheDocument();
    expect(
      within(composition!).getByRole("link", { name: /Designing Relational Data Models$/ }),
    ).toHaveAttribute("href", "/en/skills/designing-relational-data-models");
  });

  it("renders Architecture & Engineering as a real four-method installable system", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "architecture-engineering" }),
      }),
    );

    expect(container.querySelector('[data-pack-state="active"]')).toBeInTheDocument();
    const composition = container.querySelector<HTMLElement>("[data-pack-composition-map]");
    expect(composition).toBeInTheDocument();
    expect(within(composition!).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Install this pack" })).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack architecture-engineering")).toBeInTheDocument();
    expect(
      within(composition!).getByRole("link", { name: /Choosing Application Architecture$/ }),
    ).toHaveAttribute("href", "/en/skills/choosing-application-architecture");
  });

  it("connects a pack to reports using methods from the system without claiming pack usage", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "frontend-product" }),
      }),
    );

    expect(container.querySelector("[data-pack-evidence]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-pack-evidence-relation]")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Catalog experience" })).toHaveAttribute(
      "href",
      "/en/built-with-skills/catalog-experience",
    );
    expect(screen.getAllByText("3 / 8 methods represented")).toHaveLength(2);
    expect(screen.queryByText(/pack used/i)).not.toBeInTheDocument();
  });

  it("keeps planned packs honest and never renders fake installation controls", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "quality-testing" }),
      }),
    );

    expect(container.querySelector('[data-pack-state="planned"]')).toBeInTheDocument();
    expect(container.querySelector('[data-pack-blueprint="hero"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "This pack is on the roadmap" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Install this pack" })).not.toBeInTheDocument();
    expect(container.querySelector("[data-pack-composition-map]")).toBeInTheDocument();
  });
});
