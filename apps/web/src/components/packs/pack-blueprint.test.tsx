import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import PackDetailPage from "@/app/[locale]/packs/[slug]/page";

const remotePack = (slug: string) =>
  `curl -fsSL https://skills.jhonatanoliveira.com/install | bash -s -- --pack ${slug}`;

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
    expect(screen.getByText(remotePack("frontend-product"))).toBeInTheDocument();
  });

  it("explains that a pack coordinates related responsibilities without becoming a fixed workflow", async () => {
    render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "frontend-product" }),
      }),
    );

    expect(screen.getByRole("heading", { name: "How to use this pack" })).toBeInTheDocument();
    expect(screen.getByText(/not a fixed workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/responsibility stays with each member skill/i)).toBeInTheDocument();
    expect(
      screen.getByText("Method overlap only — not proof that the pack was used as a unit."),
    ).toBeInTheDocument();
  });

  for (const fixture of [
    {
      slug: "backend-data",
      links: 4,
      heading: /Designing Relational Data Models$/,
      href: "/en/skills/designing-relational-data-models",
    },
    {
      slug: "architecture-engineering",
      links: 4,
      heading: /Choosing Application Architecture$/,
      href: "/en/skills/choosing-application-architecture",
    },
    {
      slug: "quality-testing",
      links: 4,
      heading: /Designing Test Strategies$/,
      href: "/en/skills/designing-test-strategies",
    },
    {
      slug: "application-security",
      links: 4,
      heading: /Threat Modeling Applications$/,
      href: "/en/skills/threat-modeling-applications",
    },
    {
      slug: "engineering-workflow",
      links: 4,
      heading: /Planning Engineering Work$/,
      href: "/en/skills/planning-engineering-work",
    },
    {
      slug: "design-brand",
      links: 5,
      heading: /Defining Brand Strategy$/,
      href: "/en/skills/defining-brand-strategy",
    },
    {
      slug: "codebase-intelligence",
      links: 5,
      heading: /Mapping Existing Codebase Structure$/,
      href: "/en/skills/mapping-existing-codebase-structure",
    },
  ] as const) {
    it(`renders ${fixture.slug} as a real installable system`, async () => {
      const { container } = render(
        await PackDetailPage({
          params: Promise.resolve({ locale: "en", slug: fixture.slug }),
        }),
      );

      expect(container.querySelector('[data-pack-state="active"]')).toBeInTheDocument();
      const composition = container.querySelector<HTMLElement>("[data-pack-composition-map]");
      expect(composition).toBeInTheDocument();
      expect(within(composition!).getAllByRole("link")).toHaveLength(fixture.links);
      expect(screen.getByRole("heading", { name: "Install this pack" })).toBeInTheDocument();
      expect(screen.getByText(remotePack(fixture.slug))).toBeInTheDocument();
      expect(within(composition!).getByRole("link", { name: fixture.heading })).toHaveAttribute(
        "href",
        fixture.href,
      );
    });
  }

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
