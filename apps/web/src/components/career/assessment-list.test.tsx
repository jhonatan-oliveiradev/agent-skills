import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AssessmentDetailPage from "@/app/[locale]/career-lab/assessments/[id]/page";
import AssessmentsPage from "@/app/[locale]/career-lab/assessments/page";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import { CareerOnboarding } from "./career-onboarding";
import { CareerProfileProvider } from "./career-profile-provider";

function storageWithProfile(): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(
      createEmptyCareerProfile({
        targetRole: "frontend-developer",
        targetMarket: "br",
        now: "2026-09-05T16:30:00.000Z",
      }),
    ),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

describe("Assessment discovery, routes, and baseline handoff", () => {
  it("renders the default list route with baseline blueprint links", async () => {
    const page = await AssessmentsPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(page);

    expect(
      await screen.findByRole("heading", { name: /baseline assessment/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /javascript/i }),
    ).toHaveAttribute(
      "href",
      "/en/career-lab/assessments/baseline-javascript",
    );
  });

  it("renders the default detail route's runner and transitions to an observable result", async () => {
    const page = await AssessmentDetailPage({
      params: Promise.resolve({
        locale: "en",
        id: "baseline-javascript",
      }),
    });
    render(
      <CareerProfileProvider storage={storageWithProfile()}>
        {page}
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("status")).toHaveTextContent(/challenge/i);

    for (let challengeIndex = 0; challengeIndex < 12; challengeIndex += 1) {
      const answer =
        screen.queryAllByRole("radio")[0] ??
        screen.queryAllByRole("checkbox")[0];
      if (!answer) {
        throw new Error("Assessment route must render a native radio or checkbox response.");
      }
      fireEvent.click(answer);

      const next = screen.queryByRole("button", { name: /next challenge/i });
      if (!next) break;
      fireEvent.click(next);
    }

    fireEvent.click(screen.getByRole("button", { name: /complete assessment/i }));
    expect(await screen.findByText(/confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/next evidence/i)).toBeInTheDocument();
  });

  it("hands the final onboarding stage to the baseline assessment route", () => {
    render(<CareerOnboarding locale="en" onComplete={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/current context/i), {
      target: { value: "I am ready to establish a baseline." },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.click(screen.getByLabelText(/frontend developer/i));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByRole("link", { name: /start baseline assessment/i }),
    ).toHaveAttribute(
      "href",
      "/en/career-lab/assessments/baseline-javascript",
    );
  });
});
