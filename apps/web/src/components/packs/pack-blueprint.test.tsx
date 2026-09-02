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

  it("renders Quality & Testing as a real four-method installable system", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "quality-testing" }),
      }),
    );

    expect(container.querySelector('[data-pack-state="active"]')).toBeInTheDocument();
    const composition = container.querySelector<HTMLElement>("[data-pack-composition-map]");
    expect(composition).toBeInTheDocument();
    expect(within(composition!).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Install this pack" })).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack quality-testing")).toBeInTheDocument();
    expect(
      within(composition!).getByRole("link", { name: /Designing Test Strategies$/ }),
    ).toHaveAttribute("href", "/en/skills/designing-test-strategies");
  });

  it("renders Application Security as a real four-method installable system", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "application-security" }),
      }),
    );

    expect(container.querySelector('[data-pack-state="active"]')).toBeInTheDocument();
    const composition = container.querySelector<HTMLElement>("[data-pack-composition-map]");
    expect(composition).toBeInTheDocument();
    expect(within(composition!).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Install this pack" })).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack application-security")).toBeInTheDocument();
    expect(
      within(composition!).getByRole("link", { name: /Threat Modeling Applications$/ }),
    ).toHaveAttribute("href", "/en/skills/threat-modeling-applications");
  });

  it("renders Engineering Workflow as a real four-method installable system", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "engineering-workflow" }),
      }),
    );

    expect(container.querySelector('[data-pack-state="active"]')).toBeInTheDocument();
    const composition = container.querySelector<HTMLElement>("[data-pack-composition-map]");
    expect(composition).toBeInTheDocument();
    expect(within(composition!).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Install this pack" })).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack engineering-workflow")).toBeInTheDocument();
    expect(
      within(composition!).getByRole("link", { name: /Planning Engineering Work$/ }),
    ).toHaveAttribute("href", "/en/skills/planning-engineering-work");
  });

  it("renders Design & Brand as a real five-method installable system", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "design-brand" }),
      }),
    );

    expect(container.querySelector('[data-pack-state="active"]')).toBeInTheDocument();
    const composition = container.querySelector<HTMLElement>("[data-pack-composition-map]");
    expect(composition).toBeInTheDocument();
    expect(within(composition!).getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("heading", { name: "Install this pack" })).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack design-brand")).toBeInTheDocument();
    expect(
      within(composition!).getByRole("link", { name: /Defining Brand Strategy$/ }),
    ).toHaveAttribute("href", "/en/skills/defining-brand-strategy");
  });

  it("connects a pack to reports using methods from the system without claiming pack usage", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "frontend-product" }),
      }),
    );

    expect(container.querySelector("[data-pack-evidence]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-pack-evidence-relation]")).toHaveLength(5);
    expect(
      screen.getByRole("link", {
        name: "Shipping a recoverable Rocket error state through real Studio consumption",
      }),
    ).toHaveAttribute("href", "/en/built-with-skills/rocket-editorial-error-boundary");
    expect(
      screen.getByRole("link", {
        name: "Hardening Space voice credential authorization",
      }),
    ).toHaveAttribute(
      "href",
      "/en/built-with-skills/ping-space-voice-membership-authorization",
    );
    expect(
      screen.getByRole("link", {
        name: "Hardening a translation provider after a production incident",
      }),
    ).toHaveAttribute("href", "/en/built-with-skills/portfolio-translation-hardening");
    expect(screen.getByRole("link", { name: "Catalog experience" })).toHaveAttribute(
      "href",
      "/en/built-with-skills/catalog-experience",
    );
    expect(screen.getAllByText("3 / 8 methods represented")).toHaveLength(2);
    expect(screen.getAllByText("1 / 8 methods represented")).toHaveLength(3);
    expect(screen.queryByText(/pack used/i)).not.toBeInTheDocument();
  });
});
