import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import { CareerNextAction } from "./career-next-action";

describe("CareerNextAction", () => {
  it("turns the first missing baseline into one explicit next action in pt-BR", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 6,
      now: "2026-09-09T12:00:00.000Z",
    });

    render(<CareerNextAction profile={profile} locale="pt-BR" />);

    expect(screen.getByText("Agora")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Complete seu baseline de JavaScript." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/substituir um estado desconhecido por um nível sustentado por evidências/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Iniciar JavaScript" })).toHaveAttribute(
      "href",
      "/pt-BR/career-lab/assessments/baseline-javascript",
    );
  });

  it("renders the equivalent recommendation contract in English", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-09T12:00:00.000Z",
    });

    render(<CareerNextAction profile={profile} locale="en" />);

    expect(screen.getByText("Now")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Complete your JavaScript baseline." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start JavaScript" })).toHaveAttribute(
      "href",
      "/en/career-lab/assessments/baseline-javascript",
    );
  });
});
