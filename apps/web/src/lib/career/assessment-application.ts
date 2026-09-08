import {
  applyAssessmentResult,
  type AssessmentResultArtifact,
} from "./assessment";
import { recalculateRoadmap } from "./roadmap-engine";
import type { CareerProfile } from "./types";

export function applyCareerAssessmentResult(
  profile: CareerProfile,
  result: AssessmentResultArtifact,
): CareerProfile {
  const updatedProfile = applyAssessmentResult(profile, result);
  const { roadmap, decisionRecord } = recalculateRoadmap(
    updatedProfile,
    "assessment",
  );

  return {
    ...updatedProfile,
    roadmap,
    decisionRecords: decisionRecord
      ? [...updatedProfile.decisionRecords, decisionRecord]
      : updatedProfile.decisionRecords,
  };
}
