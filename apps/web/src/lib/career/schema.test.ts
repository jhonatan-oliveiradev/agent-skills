import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "./profile";
import { parseCareerProfile } from "./schema";

describe("Career Profile schema", () => {
  it("round-trips the V1 Career Profile contract", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
    });

    expect(parseCareerProfile(profile)).toEqual(profile);
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
