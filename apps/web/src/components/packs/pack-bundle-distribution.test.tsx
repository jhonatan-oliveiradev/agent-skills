import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import PackDetailPage from "@/app/[locale]/packs/[slug]/page";

describe("Pack bundle distribution", () => {
  it.each([
    [
      "en",
      "Download pack bundle",
      "For ChatGPT, extract the bundle and upload each Skill ZIP separately.",
    ],
    [
      "pt-BR",
      "Baixar pacote",
      "No ChatGPT, extraia o pacote e envie cada ZIP de skill separadamente.",
    ],
  ] as const)("offers the active pack as independent Skill ZIPs for %s", async (locale, label, note) => {
    render(
      await PackDetailPage({
        params: Promise.resolve({ locale, slug: "design-brand" }),
      }),
    );

    const download = screen.getByRole("link", { name: label });
    expect(download).toHaveAttribute(
      "href",
      "/downloads/packs/agent-skills-design-brand-1.0.0.zip",
    );
    expect(download).toHaveAttribute("download");
    expect(screen.getByText("5 skills · ZIP")).toBeInTheDocument();
    expect(screen.getByText(note)).toBeInTheDocument();
  });
});
