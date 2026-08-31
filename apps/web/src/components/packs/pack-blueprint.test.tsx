import { render, screen } from "@testing-library/react";
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

  it("keeps planned packs honest and never renders fake installation controls", async () => {
    const { container } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale: "en", slug: "backend-data" }),
      }),
    );

    expect(container.querySelector('[data-pack-state="planned"]')).toBeInTheDocument();
    expect(container.querySelector('[data-pack-blueprint="hero"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "This pack is on the roadmap" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Install this pack" })).not.toBeInTheDocument();
    expect(container.querySelector("[data-pack-composition-map]")).toBeInTheDocument();
  });
});
