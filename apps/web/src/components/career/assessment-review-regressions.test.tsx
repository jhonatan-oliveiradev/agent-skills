import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AssessmentDetailPage from "@/app/[locale]/career-lab/assessments/[id]/page";
import AssessmentsPage from "@/app/[locale]/career-lab/assessments/page";
import { baselineAssessmentBlueprints } from "@/lib/career/assessment-blueprints";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import type { AssessmentRecord, CareerProfile } from "@/lib/career/types";
import { CareerOnboarding } from "./career-onboarding";
import { CareerOverview } from "./career-overview";
import { CareerProfileProvider } from "./career-profile-provider";

function storageWith(profile: CareerProfile): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

function baselineRecord(
  blueprint: (typeof baselineAssessmentBlueprints)[number],
  index: number,
): AssessmentRecord {
  return {
    id: `assessment-${index}`,
    blueprintId: blueprint.id,
    blueprintVersion: blueprint.version,
    competencyId: blueprint.competencyId,
    level: "developing",
    confidence: "low",
    evidenceIds: [],
    completedAt: `2026-09-07T12:0${index}:00.000Z`,
    trust: "local-deterministic",
  };
}

function advanceOnboarding() {
  fireEvent.change(screen.getByLabelText(/current context/i), {
    target: { value: "I am ready to establish a baseline." },
  });
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
  fireEvent.click(screen.getByLabelText(/frontend developer/i));
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
}

describe("assessment review integration regressions", () => {
  it("localizes the PT-BR assessment list, runner, result and baseline prompt", async () => {
    const listPage = await AssessmentsPage({
      params: Promise.resolve({ locale: "pt-BR" }),
    });
    const list = render(listPage);

    expect(
      await screen.findByRole("heading", { name: /avaliações de baseline/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/sondagens curtas e determinísticas/i)).toBeInTheDocument();
    list.unmount();

    const detailPage = await AssessmentDetailPage({
      params: Promise.resolve({ locale: "pt-BR", id: "baseline-javascript" }),
    });
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-07T12:00:00.000Z",
    });
    render(
      <CareerProfileProvider storage={storageWith(profile)}>
        {detailPage}
      </CareerProfileProvider>,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/desafio 1 de 1/i);
    expect(
      screen.getByRole("heading", { name: /qual limite mantém o estado da interação local/i }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("radio", { name: /o componente que controla a interação/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /concluir avaliação/i }));

    expect(await screen.findByRole("heading", { name: /em desenvolvimento/i })).toBeInTheDocument();
    expect(screen.getByText(/baixa confiança/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /sinais fortes/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /próxima evidência/i })).toBeInTheDocument();
  });

  it("persists the neutral profile before handing onboarding to the baseline route", () => {
    const onComplete = vi.fn();
    const onStartBaseline = vi.fn();
    render(
      <CareerOnboarding
        locale="en"
        onComplete={onComplete}
        onStartBaseline={onStartBaseline}
      />,
    );
    advanceOnboarding();

    fireEvent.click(screen.getByRole("link", { name: /start baseline assessment/i }));

    expect(onStartBaseline).toHaveBeenCalledTimes(1);
    expect(onStartBaseline).toHaveBeenCalledWith(expect.objectContaining({
      targetRoles: ["frontend-developer"],
      assessments: [],
      evidence: [],
    }));
    const created = onStartBaseline.mock.calls[0]?.[0] as CareerProfile | undefined;
    expect(created?.competencies.length).toBeGreaterThan(0);
    expect(created?.competencies.every(
      (competency) => competency.level === null && competency.confidence === "low",
    )).toBe(true);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("keeps Overview baseline-incomplete until all six baseline blueprints are recorded", async () => {
    const base = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-07T12:00:00.000Z",
    });
    const partial = {
      ...base,
      assessments: [baselineRecord(baselineAssessmentBlueprints[0], 0)],
    } satisfies CareerProfile;
    const partialView = render(
      <CareerProfileProvider storage={storageWith(partial)}>
        <CareerOverview locale="en" />
      </CareerProfileProvider>,
    );

    expect(
      await screen.findByText(/baseline assessment still incomplete/i),
    ).toBeInTheDocument();
    partialView.unmount();

    const complete = {
      ...base,
      assessments: baselineAssessmentBlueprints.map(baselineRecord),
    } satisfies CareerProfile;
    render(
      <CareerProfileProvider storage={storageWith(complete)}>
        <CareerOverview locale="en" />
      </CareerProfileProvider>,
    );

    await screen.findByRole("heading", { name: /frontend developer/i });
    expect(screen.queryByText(/baseline assessment still incomplete/i)).not.toBeInTheDocument();
  });
});
