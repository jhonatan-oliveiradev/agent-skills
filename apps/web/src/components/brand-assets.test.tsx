import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
}));

import { metadata } from "@/app/[locale]/layout";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { ThemeProvider } from "./theme-provider";

describe("Agent Skills Studio brand assets", () => {
  it("uses the supplied horizontal logo in the shared header", () => {
    render(
      <ThemeProvider attribute="class">
        <SiteHeader locale="en" />
      </ThemeProvider>,
    );

    const brandLink = screen.getByRole("link", { name: "Agent Skills Studio" });
    expect(brandLink).toHaveAttribute("href", "/en");
    expect(brandLink.querySelector("img")).toHaveAttribute(
      "src",
      "/brand/agent-skills-logo-horizontal.svg",
    );
  });

  it("uses the supplied horizontal logo as the footer wordmark", () => {
    const { container } = render(<SiteFooter locale="en" />);

    expect(container.querySelector(".site-footer__brand-logo")).toHaveAttribute(
      "src",
      "/brand/agent-skills-logo-horizontal.svg",
    );
  });

  it("publishes the supplied favicon set and web manifest", () => {
    expect(metadata.manifest).toBe("/site.webmanifest");
    expect(metadata.icons).toMatchObject({
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    });
  });
});
