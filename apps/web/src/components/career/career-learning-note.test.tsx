import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getLearningNote } from "@/lib/career/learning-catalog";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import type { CareerProfile, LearningProgressRecord } from "@/lib/career/types";
import { CareerLearningNote } from "./career-learning-note";
import { CareerProfileProvider } from "./career-profile-provider";

const now = "2026-09-11T12:00:00.000Z";
const noteId = "typescript-application-modeling";
const foundationModuleId = "programming-typescript-foundation";
const foundationPracticeId = "programming-typescript-foundation-practice";

function storageWith(profile: CareerProfile | null): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
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

function progress(overrides: Partial<LearningProgressRecord> = {}): LearningProgressRecord {
  return {
    noteId,
    startedAt: now,
    updatedAt: now,
    currentModuleId: foundationModuleId,
    completedModuleIds: [],
    completedPracticeIds: [],
    completedAt: null,
    ...overrides,
  };
}

function renderNote(
  locale: "en" | "pt-BR",
  subject: CareerProfile | null = profile(),
  storage = storageWith(subject),
) {
  return {
    storage,
    ...render(
      <CareerProfileProvider storage={storage}>
        <CareerLearningNote locale={locale} noteId={noteId} />
      </CareerProfileProvider>,
    ),
  };
}

describe("Career Learning Core Note reader", () => {
  it("renders only reviewed modules with a native module index and the exact semantic sequence", async () => {
    renderNote("en");

    const foundation = await screen.findByRole("region", { name: "Narrow before use" });
    const moduleLink = screen.getByRole("link", { name: "Narrow before use" });
    expect(moduleLink.tagName).toBe("A");
    expect(moduleLink).toHaveAttribute("href", `#${foundationModuleId}`);
    expect(foundation).toHaveAttribute("id", foundationModuleId);

    expect(
      within(foundation)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Understand",
      "See",
      "Avoid this mistake",
      "Practice",
      "Consolidated when",
      "Sources",
    ]);

    expect(screen.getAllByText("Reviewed").length).toBeGreaterThanOrEqual(4);
    expect(screen.queryByText(/draft/i)).not.toBeInTheDocument();
  });

  it("renders source provenance with title, publisher, authority, and review date", async () => {
    renderNote("en");

    const foundation = await screen.findByRole("region", { name: "Narrow before use" });
    const sources = within(foundation).getByRole("list", { name: "Sources" });
    const narrowing = within(sources).getByRole("link", { name: "Narrowing" });

    expect(narrowing).toHaveAttribute(
      "href",
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
    );
    expect(within(sources).getByText("TypeScript")).toBeInTheDocument();
    expect(within(sources).getByText(/primary/i)).toBeInTheDocument();
    expect(within(sources).getByText("2026-09-11")).toBeInTheDocument();
  });

  it("renders reviewed code examples inside pre > code", async () => {
    const { container } = renderNote("en");

    await screen.findByRole("region", { name: "Narrow before use" });
    const code = container.querySelector(`#${foundationModuleId} pre > code`);
    expect(code).not.toBeNull();
    expect(code?.textContent).toContain("function format(value: string | number)");
  });

  it("records practice and module progress only after explicit controls", async () => {
    const subject = profile();
    const storage = storageWith(subject);
    renderNote("en", subject, storage);

    const foundation = await screen.findByRole("region", { name: "Narrow before use" });
    const practiceButton = within(foundation).getByRole("button", {
      name: "Mark practice complete",
    });
    const moduleButton = within(foundation).getByRole("button", {
      name: "Mark module studied",
    });

    expect(storage.save).not.toHaveBeenCalled();
    expect(moduleButton).toBeDisabled();

    fireEvent.click(practiceButton);
    await waitFor(() => expect(storage.save).toHaveBeenCalledTimes(1));

    const afterPractice = vi.mocked(storage.save).mock.calls[0]?.[0];
    expect(afterPractice?.learningProgress).toEqual([
      expect.objectContaining({
        noteId,
        currentModuleId: foundationModuleId,
        completedPracticeIds: [foundationPracticeId],
        completedModuleIds: [],
      }),
    ]);

    await waitFor(() => expect(moduleButton).not.toBeDisabled());
    fireEvent.click(moduleButton);
    await waitFor(() => expect(storage.save).toHaveBeenCalledTimes(2));

    const afterModule = vi.mocked(storage.save).mock.calls[1]?.[0];
    expect(afterModule?.learningProgress[0]?.completedModuleIds).toContain(foundationModuleId);
  });

  it("does not mutate evidence, competencies, assessments, or roadmap state when study progress changes", async () => {
    const subject = profile({
      competencies: [
        {
          competencyId: "programming-typescript",
          level: "foundation",
          confidence: "medium",
          evidenceIds: ["evidence-1"],
          lastAssessedAt: now,
        },
      ],
      evidence: [
        {
          id: "evidence-1",
          competencyId: "programming-typescript",
          class: "E2",
          sourceType: "assessment",
          trust: "local-deterministic",
          observedAt: now,
          summary: "Existing evidence",
        },
      ],
      assessments: [
        {
          id: "assessment-1",
          blueprintId: "baseline-typescript",
          blueprintVersion: "1",
          competencyId: "programming-typescript",
          level: "foundation",
          confidence: "medium",
          evidenceIds: ["evidence-1"],
          completedAt: now,
          trust: "local-deterministic",
        },
      ],
      roadmap: {
        milestoneIds: ["typed-application-modeling"],
        currentFocusMilestoneId: "typed-application-modeling",
        supportingActivityId: null,
      },
    });
    const storage = storageWith(subject);
    renderNote("en", subject, storage);

    const foundation = await screen.findByRole("region", { name: "Narrow before use" });
    fireEvent.click(
      within(foundation).getByRole("button", { name: "Mark practice complete" }),
    );
    await waitFor(() => expect(storage.save).toHaveBeenCalledTimes(1));

    const saved = vi.mocked(storage.save).mock.calls[0]?.[0];
    expect(saved?.evidence).toEqual(subject.evidence);
    expect(saved?.competencies).toEqual(subject.competencies);
    expect(saved?.assessments).toEqual(subject.assessments);
    expect(saved?.roadmap).toEqual(subject.roadmap);
  });

  it("shows studied content as still requiring proof", async () => {
    const reviewedModuleIds = [
      "programming-typescript-foundation",
      "programming-typescript-developing",
      "programming-typescript-proficient",
      "programming-typescript-advanced",
    ];
    renderNote(
      "pt-BR",
      profile({
        learningProgress: [
          progress({
            currentModuleId: "programming-typescript-advanced",
            completedModuleIds: reviewedModuleIds,
            completedAt: now,
          }),
        ],
      }),
    );

    expect(await screen.findByText("Conteúdo estudado")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Estudar este conteúdo não comprova proficiência. Ainda é necessária uma evidência ou avaliação.",
      ),
    ).toBeInTheDocument();
  });

  it("hides draft module bodies and publishes an incomplete-coverage notice", async () => {
    const note = getLearningNote(noteId)!;
    const draftModule = note.modules[1] as { reviewStatus: "draft" | "reviewed"; title: { en: string } };
    const originalStatus = draftModule.reviewStatus;
    const draftTitle = draftModule.title.en;

    try {
      draftModule.reviewStatus = "draft";
      renderNote("en");

      expect(await screen.findByText("Core Note")).toBeInTheDocument();
      expect(screen.queryByRole("region", { name: draftTitle })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: draftTitle })).not.toBeInTheDocument();
      expect(
        screen.getByText(
          "This Core Note has material still under review. Draft module content is intentionally hidden.",
        ),
      ).toBeInTheDocument();
    } finally {
      draftModule.reviewStatus = originalStatus;
    }
  });
});
