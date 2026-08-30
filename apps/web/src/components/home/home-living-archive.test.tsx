import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));

import HomePage from "@/app/[locale]/page";

describe("Living Research Archive Home", () => {
  it.each([
    ["en", "From a problem to an outcome."],
    ["pt-BR", "Do problema ao resultado."],
  ] as const)("renders three acts without a standalone transformation section for %s", async (locale, oldTransformationHeading) => {
    const { container } = render(await HomePage({ params: Promise.resolve({ locale }) }));

    expect(container.querySelectorAll("[data-home-act]")).toHaveLength(3);
    expect(screen.queryByRole("heading", { name: oldTransformationHeading })).not.toBeInTheDocument();
  });
});
