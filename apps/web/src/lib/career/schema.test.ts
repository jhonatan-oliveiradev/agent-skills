import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "./profile";
import { parseCareerProfile } from "./schema";

describe("Career Profile schema", () => {
  it("round-trips the V2 Career Profile contract", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
    });

    expect(parseCareerProfile(profile)).toEqual(profile);
  });

  it("round-trips structurally valid learning progress", () => {
    const profile = {
      ...createEmptyCareerProfile({
        targetRole: "frontend-developer",
        targetMarket: "br",
        now: "2026-09-11T12:00:00.000Z",
      }),
      learningProgress: [
        {
          noteId: "typescript-application-modeling",
          startedAt: "2026-09-11T12:00:00.000Z",
          updatedAt: "2026-09-11T12:10:00.000Z",
          currentModuleId: "programming-typescript-developing",
          completedModuleIds: ["programming-typescript-foundation"],
          completedPracticeIds: ["programming-typescript-foundation-practice"],
          completedAt: null,
        },
      ],
    };

    expect(parseCareerProfile(profile).learningProgress).toEqual(profile.learningProgress);
  });

  it("rejects duplicate note progress records and completed ids", () => {
    const record = {
      noteId: "typescript-application-modeling",
      startedAt: "2026-09-11T12:00:00.000Z",
      updatedAt: "2026-09-11T12:10:00.000Z",
      currentModuleId: null,
      completedModuleIds: [],
      completedPracticeIds: [],
      completedAt: null,
    };
    const base = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
    });

    expect(() => parseCareerProfile({ ...base, learningProgress: [record, { ...record }] })).toThrow(
      /duplicate.*note/i,
    );
    expect(() =>
      parseCareerProfile({
        ...base,
        learningProgress: [
          { ...record, completedModuleIds: ["module-a", "module-a"] },
        ],
      }),
    ).toThrow(/duplicate.*completedModuleIds|completedModuleIds.*duplicate/i);
    expect(() =>
      parseCareerProfile({
        ...base,
        learningProgress: [
          { ...record, completedPracticeIds: ["practice-a", "practice-a"] },
        ],
      }),
    ).toThrow(/duplicate.*completedPracticeIds|completedPracticeIds.*duplicate/i);
  });

  it("rejects invalid and non-monotonic learning progress timestamps", () => {
    const base = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
    });
    const record = {
      noteId: "typescript-application-modeling",
      startedAt: "2026-09-11T12:00:00.000Z",
      updatedAt: "2026-09-11T12:10:00.000Z",
      currentModuleId: null,
      completedModuleIds: [],
      completedPracticeIds: [],
      completedAt: null,
    };

    for (const [field, value] of [
      ["startedAt", "not-a-date"],
      ["updatedAt", "not-a-date"],
      ["completedAt", "not-a-date"],
    ] as const) {
      expect(() =>
        parseCareerProfile({
          ...base,
          learningProgress: [{ ...record, [field]: value }],
        }),
      ).toThrow(new RegExp(field, "i"));
    }

    expect(() =>
      parseCareerProfile({
        ...base,
        learningProgress: [
          {
            ...record,
            startedAt: "2026-09-11T12:10:00.000Z",
            updatedAt: "2026-09-11T12:00:00.000Z",
          },
        ],
      }),
    ).toThrow(/updatedAt.*startedAt|startedAt.*updatedAt/i);
  });

  it("requires learningProgress on schema v2 profiles", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
    });
    const { learningProgress: _learningProgress, ...withoutLearningProgress } = profile;

    expect(() => parseCareerProfile(withoutLearningProgress)).toThrow(/learningProgress/i);
  });

  it("rejects an unknown schema version instead of mutating local state", () => {
    expect(() => parseCareerProfile({ schemaVersion: "99" })).toThrow(
      /unsupported career profile schema/i,
    );
  });

  it("keeps imported external assessment evidence explicitly unverified", () => {
    const profile = parseCareerProfile({
      ...createEmptyCareerProfile({
        targetRole: "frontend-developer",
        targetMarket: "br",
      }),
      evidence: [
        {
          id: "ev-1",
          competencyId: "programming-javascript",
          class: "E3",
          sourceType: "assessment",
          trust: "external-unverified",
          observedAt: "2026-09-04",
          summary: "Imported implementation assessment",
        },
      ],
    });

    expect(profile.evidence[0]?.trust).toBe("external-unverified");
  });

  it("preserves structured criterion observations needed by deterministic competency gates", () => {
    const profile = parseCareerProfile({
      ...createEmptyCareerProfile({
        targetRole: "frontend-developer",
        targetMarket: "br",
      }),
      evidence: [
        {
          id: "ev-criterion",
          competencyId: "programming-javascript",
          class: "E3",
          sourceType: "assessment",
          trust: "local-deterministic",
          observedAt: "2026-09-04T12:00:00.000Z",
          summary: "Observed implementation behavior",
          demonstratedLevel: "proficient",
          criterionIds: ["programming-javascript.proficient"],
        },
      ],
    });

    expect(profile.evidence[0]?.demonstratedLevel).toBe("proficient");
    expect(profile.evidence[0]?.criterionIds).toEqual(["programming-javascript.proficient"]);
  });

  it("fails closed instead of coercing malformed required fields", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
    });

    expect(() =>
      parseCareerProfile({
        ...profile,
        weeklyStudyHours: "8",
      }),
    ).toThrow(/weeklyStudyHours/i);

    expect(() =>
      parseCareerProfile({
        ...profile,
        targetRoles: undefined,
      }),
    ).toThrow(/targetRoles/i);
  });
});
