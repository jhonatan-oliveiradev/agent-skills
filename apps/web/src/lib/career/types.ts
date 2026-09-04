export type TargetRoleId =
  | "frontend-developer"
  | "backend-developer"
  | "fullstack-developer";

export type ProficiencyLevel = "foundation" | "developing" | "proficient" | "advanced";
export type ConfidenceLevel = "low" | "medium" | "high";
export type EvidenceClass = "E0" | "E1" | "E2" | "E3" | "E4";
export type EvidenceTrust = "local-deterministic" | "external-unverified" | "user-claimed";
export type MilestoneStatus =
  | "locked"
  | "available"
  | "in-progress"
  | "ready-for-assessment"
  | "completed";

export type EvidenceSourceType = "self-report" | "assessment" | "portfolio" | "practice";

export interface CompetencyState {
  readonly competencyId: string;
  readonly level: ProficiencyLevel | null;
  readonly confidence: ConfidenceLevel;
  readonly evidenceIds: readonly string[];
  readonly lastAssessedAt: string | null;
}

export interface EvidenceRecord {
  readonly id: string;
  readonly competencyId: string;
  readonly class: EvidenceClass;
  readonly sourceType: EvidenceSourceType;
  readonly trust: EvidenceTrust;
  readonly observedAt: string;
  readonly summary: string;
  readonly sourceUrl?: string;
}

export interface AssessmentRecord {
  readonly id: string;
  readonly blueprintId: string;
  readonly blueprintVersion: string;
  readonly competencyId: string;
  readonly level: ProficiencyLevel;
  readonly confidence: ConfidenceLevel;
  readonly evidenceIds: readonly string[];
  readonly completedAt: string;
  readonly trust: EvidenceTrust;
}

export interface RoadmapState {
  readonly milestoneIds: readonly string[];
  readonly currentFocusMilestoneId: string | null;
  readonly supportingActivityId: string | null;
}

export interface MarketSample {
  readonly id: string;
  readonly targetRole: TargetRoleId;
  readonly targetMarket: string;
  readonly capturedAt: string;
  readonly postingCount: number;
  readonly distinctCompanyCount: number;
  readonly distinctSourceCount: number;
}

export interface DecisionRecord {
  readonly id: string;
  readonly kind: "roadmap-recalculation" | "target-change" | "profile-import";
  readonly reason: string;
  readonly summary: string;
  readonly createdAt: string;
  readonly beforeMilestoneIds?: readonly string[];
  readonly afterMilestoneIds?: readonly string[];
}

export interface CareerProfile {
  readonly schemaVersion: "1";
  readonly targetRoles: readonly TargetRoleId[];
  readonly targetMarkets: readonly string[];
  readonly weeklyStudyHours: number | null;
  readonly competencies: readonly CompetencyState[];
  readonly assessments: readonly AssessmentRecord[];
  readonly roadmap: RoadmapState;
  readonly evidence: readonly EvidenceRecord[];
  readonly marketSamples: readonly MarketSample[];
  readonly decisionRecords: readonly DecisionRecord[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type CareerArtifactType =
  | "assessment-result"
  | "roadmap-update"
  | "learning-unit"
  | "portfolio-evidence"
  | "market-analysis";

export interface CareerArtifact {
  readonly schemaVersion: "1";
  readonly artifactType: CareerArtifactType;
  readonly provenance: Readonly<{ trust: EvidenceTrust }>;
  readonly [key: string]: unknown;
}
