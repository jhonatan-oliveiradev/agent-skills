import { render, screen } from "@testing-library/react";
import type { Route } from "next";
import { describe, expect, it } from "vitest";
import { CareerSectionGuidance } from "./career-section-guidance";

describe("CareerSectionGuidance", () => {
  it("renders compact operational guidance with one optional destination", () => {
    render(
      <CareerSectionGuidance
        eyebrow="Working contract"
        title="Use this focus now"
        body="Finish the capability and evidence gates before moving on."
        action={{
          href: "/en/career-lab/evidence" as Route,
          label: "Register evidence",
        }}
      />,
    );

    expect(screen.getByText("Working contract")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Use this focus now" })).toBeInTheDocument();
    expect(screen.getByText(/capability and evidence gates/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register evidence" })).toHaveAttribute(
      "href",
      "/en/career-lab/evidence",
    );
  });
});
