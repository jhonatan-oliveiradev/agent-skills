import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AssessmentDetailPage from "@/app/[locale]/career-lab/assessments/[id]/page";
import AssessmentsPage from "@/app/[locale]/career-lab/assessments/page";
import { baselineAssessmentBlueprints } from "@/lib/career/assessment-blueprints";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import type { AssessmentRecord, CareerProfile } from "@/lib/career/types";
import { AssessmentList } from "./assessment-list";
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

function storageWith(profile: CareerProfile): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

function profileWithCompletedAssessment(blueprintId: string): CareerProfile {
  const base = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    now: "2026-09-09T18:00:00.000Z",
  });
  const blueprint = baselineAssessmentBlueprints.find((candidate) => candidate.id === blueprintId);
  if (!blueprint) throw new Error(`Unknown blueprint: ${blueprintId}`);

  const record: AssessmentRecord = {
    id: `assessment-${blueprint.id}`,
    blueprintId: blueprint.id,
    blueprintVersion: blueprint.version,
    competencyId: blueprint.competencyId,
    level: "developing",
    confidence: "low",
    evidenceIds: [],
    completedAt: "2026-09-09T18:10:00.000Z",
    trust: "local-deterministic",
  };

  return { ...base, assessments: [record] };
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

  it("renders baseline progress and actionable rows in pt-BR", async () => {
    render(
      <CareerProfileProvider storage={storageWith(profileWithCompletedAssessment("baseline-javascript"))}>
        <AssessmentList locale="pt-BR" blueprints={baselineAssessmentBlueprints} />
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Avaliações de baseline" })).toBeInTheDocument();
    expect(screen.getByText("1 de 6 concluídas")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /revisar javascript/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /iniciar typescript/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("assessment-index-row")).toHaveLength(6);
  });

  it("renders baseline progress and actionable rows in English", async () => {
    render(
      <CareerProfileProvider storage={storageWith(profileWithCompletedAssessment("baseline-javascript"))}>
        <AssessmentList locale="en" blueprints={baselineAssessmentBlueprints} />
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Baseline assessments" })).toBeInTheDocument();
    expect(screen.getByText("1 of 6 completed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /review javascript/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start typescript/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("assessment-index-row")).toHaveLength(6);
  });
});
