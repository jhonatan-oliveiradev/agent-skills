import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CareerOnboarding } from "./career-onboarding";

function chooseRoleAndAdvance() {
  fireEvent.change(screen.getByLabelText(/current context/i), {
    target: { value: "I build production React interfaces and APIs." },
  });
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
  fireEvent.click(screen.getByLabelText(/frontend developer/i));
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
}

describe("Career onboarding", () => {
  it("captures context, role, market and weekly capacity before creating a profile", () => {
    const onComplete = vi.fn();
    render(<CareerOnboarding locale="en" onComplete={onComplete} />);

    chooseRoleAndAdvance();

    fireEvent.change(screen.getByLabelText(/target market/i), { target: { value: "br" } });
    fireEvent.change(screen.getByLabelText(/weekly study hours/i), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/baseline diagnostic/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /create career profile/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    const profile = onComplete.mock.calls[0]?.[0];
    expect(profile.targetRoles).toEqual(["frontend-developer"]);
    expect(profile.targetMarkets).toEqual(["br"]);
    expect(profile.weeklyStudyHours).toBe(8);
    expect(profile.competencies.length).toBeGreaterThan(0);
    expect(profile.competencies.every((state: { level: unknown; confidence: string }) => state.level === null && state.confidence === "low")).toBe(true);
  });

  it("does not let the undecided UI state finish without choosing a V1 target role", () => {
    render(<CareerOnboarding locale="en" onComplete={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/current context/i), { target: { value: "Still exploring." } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.click(screen.getByLabelText(/undecided/i));

    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });
});
