import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CareerGuide } from "./career-guide";

describe("CareerGuide", () => {
  it("renders the complete operating model and Q&A in pt-BR", () => {
    render(<CareerGuide locale="pt-BR" />);

    expect(screen.getByRole("heading", { name: "Comece aqui" })).toBeInTheDocument();
    expect(screen.getAllByTestId("career-guide-area")).toHaveLength(5);
    expect(screen.getByText("Por que meu readiness está em 0%?")).toBeInTheDocument();
    expect(screen.getAllByTestId("career-guide-question").length).toBeGreaterThanOrEqual(12);
  });

  it("renders the complete operating model and Q&A in English", () => {
    render(<CareerGuide locale="en" />);

    expect(screen.getByRole("heading", { name: "Start here" })).toBeInTheDocument();
    expect(screen.getAllByTestId("career-guide-area")).toHaveLength(5);
    expect(screen.getByText("Why is my readiness 0%?")).toBeInTheDocument();
    expect(screen.getAllByTestId("career-guide-question").length).toBeGreaterThanOrEqual(12);
  });

  it("keeps native details semantics while exposing an animatable answer wrapper", () => {
    render(<CareerGuide locale="pt-BR" />);

    const question = screen.getAllByTestId("career-guide-question")[0];
    expect(question.tagName).toBe("DETAILS");

    const summary = question.querySelector("summary");
    const answer = question.querySelector(".career-guide__answer");
    const inner = question.querySelector(".career-guide__answer-inner");

    expect(summary).toBeInTheDocument();
    expect(answer).toBeInTheDocument();
    expect(inner).toBeInTheDocument();
    expect(question).not.toHaveAttribute("open");

    fireEvent.click(summary!);
    expect(question).toHaveAttribute("open");
  });
});
