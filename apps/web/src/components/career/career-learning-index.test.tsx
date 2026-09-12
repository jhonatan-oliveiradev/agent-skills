import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import type {
  CareerProfile,
  CompetencyState,
  LearningProgressRecord,
  ProficiencyLevel,
} from "@/lib/career/types";
import { CareerLearningIndex } from "./career-learning-index";
import { CareerProfileProvider } from "./career-profile-provider";

const now = "2026-09-11T12:00:00.000Z";

function storageWith(profile: CareerProfile | null): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

function competencyState(
  competencyId: string,
  level: ProficiencyLevel | null,
): CompetencyState {
  return {
    competencyId,
    level,
    confidence: "low",
    evidenceIds: [],
    lastAssessedAt: null,
  };
}

function learningProgress(
  noteId: string,
  options: Readonly<{
    currentModuleId?: string | null;
    completedModuleIds?: readonly string[];
    completedPracticeIds?: readonly string[];
    completedAt?: string | null;
  }> = {},
): LearningProgressRecord {
  return {
    noteId,
    startedAt: now,
    updatedAt: now,
    currentModuleId: options.currentModuleId ?? null,
    completedModuleIds: options.completedModuleIds ?? [],
    completedPracticeIds: options.completedPracticeIds ?? [],
    completedAt: options.completedAt ?? null,
  };
}

function profile(overrides: Partial<CareerProfile> = {}): CareerProfile {
  return {
    ...createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now,
    }),
    ...overrides,
  };
}

function renderIndex(locale: "en" | "pt-BR", subject: CareerProfile | null) {
  return render(
    <CareerProfileProvider storage={storageWith(subject)}>
      <CareerLearningIndex locale={locale} />
    </CareerProfileProvider>,
  );
}

describe("Career Learning index", () => {
  it("shows one explainable Recommended now study action for a mapped gap", async () => {
    renderIndex(
      "en",
      profile({
        competencies: [competencyState("programming-javascript", "developing")],
      }),
    );

    const recommended = await screen.findByRole("region", { name: "Recommended now" });
    expect(within(recommended).getAllByRole("link")).toHaveLength(1);
    expect(within(recommended).getByRole("link")).toHaveAttribute(
      "href",
      "/en/career-lab/learning/javascript-programming#programming-javascript-proficient",
    );
    expect(within(recommended).getByText("Blocking capability gap")).toBeInTheDocument();

    const sections = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(sections).toEqual(["Recommended now", "Current learning path", "Explore competencies"]);
  });

  it("shows a proof-oriented recommendation after the relevant module is studied", async () => {
    renderIndex(
      "en",
      profile({
        competencies: [competencyState("programming-javascript", "foundation")],
        learningProgress: [
          learningProgress("javascript-programming", {
            completedModuleIds: ["programming-javascript-developing"],
          }),
        ],
      }),
    );

    const recommended = await screen.findByRole("region", { name: "Recommended now" });
    expect(within(recommended).getByText("Studied — proof still required")).toBeInTheDocument();
    expect(within(recommended).getByRole("link")).toHaveAttribute(
      "href",
      "/en/career-lab/assessments",
    );
    expect(within(recommended).queryByText(/study again/i)).not.toBeInTheDocument();
  });

  it("shows Explore competencies without fabricating personalization when no profile exists", async () => {
    renderIndex("en", null);

    const explore = await screen.findByRole("region", { name: "Explore competencies" });
    expect(within(explore).getByRole("link", { name: /JavaScript programming/i })).toHaveAttribute(
      "href",
      "/en/career-lab/learning/javascript-programming",
    );
    expect(screen.getByText("Create a Career Profile to unlock contextual recommendations.")).toBeInTheDocument();
    expect(screen.queryByText("Blocking capability gap")).not.toBeInTheDocument();
  });

  it("uses only Not started, In progress, and Studied language for note progress", async () => {
    renderIndex(
      "en",
      profile({
        learningProgress: [
          learningProgress("javascript-programming", {
            currentModuleId: "programming-javascript-foundation",
          }),
          learningProgress("testing-observable-behavior", {
            currentModuleId: "testing-behavior-advanced",
            completedModuleIds: [
              "testing-behavior-foundation",
              "testing-behavior-developing",
              "testing-behavior-proficient",
              "testing-behavior-advanced",
            ],
            completedPracticeIds: [
              "testing-behavior-foundation-practice",
              "testing-behavior-developing-practice",
              "testing-behavior-proficient-practice",
              "testing-behavior-advanced-practice",
            ],
            completedAt: now,
          }),
        ],
      }),
    );

    await screen.findByRole("region", { name: "Explore competencies" });
    expect(screen.getAllByText("Not started").length).toBeGreaterThan(0);
    expect(screen.getAllByText("In progress").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Studied").length).toBeGreaterThan(0);
    expect(screen.queryByText(/complete course|completed course|mastered/i)).not.toBeInTheDocument();
  });

  it("does not render proficiency/readiness percentages on learning cards", async () => {
    const { container } = renderIndex(
      "en",
      profile({
        competencies: [competencyState("programming-javascript", "developing")],
      }),
    );

    await screen.findByRole("region", { name: "Explore competencies" });
    expect(container.textContent).not.toMatch(/\b\d{1,3}%\b/);
    expect(screen.queryByText(/role readiness/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/proficiency score/i)).not.toBeInTheDocument();
  });
});
