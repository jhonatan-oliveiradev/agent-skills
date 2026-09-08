import type { Locale } from "../locales";
import {
  competencyDefinitions,
  deriveCompetencyState,
  type CompetencyId,
} from "./competencies";
import { getRoadmapMilestone } from "./roadmap-catalog";
import { recalculateRoadmap } from "./roadmap-engine";
import type {
  CareerProfile,
  EvidenceRecord,
  ProficiencyLevel,
} from "./types";

export interface PortfolioEvidenceCapability {
  readonly competencyId: CompetencyId;
  readonly targetLevel: ProficiencyLevel;
  readonly criterionIds: readonly string[];
}

export interface PortfolioEvidenceChecklistItem {
  readonly id: string;
  readonly label: Readonly<Record<Locale, string>>;
}

export interface PortfolioEvidenceContract {
  readonly id: string;
  readonly milestoneId: string;
  readonly title: Readonly<Record<Locale, string>>;
  readonly problem: Readonly<Record<Locale, string>>;
  readonly artifact: Readonly<Record<Locale, string>>;
  readonly capabilities: readonly PortfolioEvidenceCapability[];
  readonly acceptanceChecklist: readonly PortfolioEvidenceChecklistItem[];
  readonly suggestedVerification: readonly Readonly<Record<Locale, string>>[];
  readonly repositoryUrl?: string;
}

export interface PortfolioEvidenceInput {
  readonly summary: string;
  readonly repositoryUrl?: string;
  readonly completedChecklistIds: readonly string[];
  readonly observedAt?: string;
}

const proficiencyRank: Readonly<Record<ProficiencyLevel, number>> = {
  foundation: 0,
  developing: 1,
  proficient: 2,
  advanced: 3,
};

function competencyDefinition(competencyId: string) {
  const definition = competencyDefinitions.find((candidate) => candidate.id === competencyId);
  if (!definition) throw new Error(`Unknown competency: ${competencyId}`);
  return definition;
}

function criteriaThroughLevel(
  competencyId: CompetencyId,
  targetLevel: ProficiencyLevel,
): readonly string[] {
  const definition = competencyDefinition(competencyId);
  return definition.criteria
    .filter((criterion) => proficiencyRank[criterion.level] <= proficiencyRank[targetLevel])
    .map((criterion) => criterion.id);
}

export function buildPortfolioEvidenceContract(
  profile: CareerProfile,
  milestoneId: string,
): PortfolioEvidenceContract {
  if (!profile.roadmap.milestoneIds.includes(milestoneId)) {
    throw new Error(`Portfolio evidence milestone is not part of the active roadmap: ${milestoneId}`);
  }

  const milestone = getRoadmapMilestone(milestoneId);
  const capabilities = milestone.requirements.map((requirement) => ({
    competencyId: requirement.competencyId,
    targetLevel: requirement.targetLevel,
    criterionIds: criteriaThroughLevel(requirement.competencyId, requirement.targetLevel),
  }));
  const acceptanceChecklist: PortfolioEvidenceChecklistItem[] = [
    ...capabilities.map((capability) => ({
      id: `capability:${capability.competencyId}`,
      label: {
        en: `The artifact demonstrates ${capability.competencyId} at the ${capability.targetLevel} target with concrete implementation evidence.`,
        "pt-BR": `O artefato demonstra ${capability.competencyId} no alvo ${capability.targetLevel} com evidência concreta de implementação.`,
      },
    })),
    {
      id: "traceability",
      label: {
        en: "The evidence points to inspectable files, commits, pull requests, screenshots, logs, or another concrete artifact.",
        "pt-BR": "A evidência aponta para arquivos, commits, pull requests, screenshots, logs ou outro artefato concreto e inspecionável.",
      },
    },
    {
      id: "verification",
      label: {
        en: "The artifact includes or references verification of the behavior being claimed.",
        "pt-BR": "O artefato inclui ou referencia verificação do comportamento que está sendo reivindicado.",
      },
    },
  ];

  return {
    id: `portfolio-contract:${milestone.id}`,
    milestoneId: milestone.id,
    title: {
      en: `${milestone.title.en} evidence contract`,
      "pt-BR": `Contrato de evidência — ${milestone.title["pt-BR"]}`,
    },
    problem: {
      en: `Produce a real project artifact that addresses the ${milestone.title.en.toLowerCase()} milestone rather than a generic tutorial exercise.`,
      "pt-BR": `Produza um artefato de projeto real que responda ao marco ${milestone.title["pt-BR"].toLowerCase()}, em vez de um exercício genérico de tutorial.`,
    },
    artifact: {
      en: "Use an inspectable repository, pull request, implementation diff, test report, decision record, or equivalent work sample.",
      "pt-BR": "Use um repositório, pull request, diff de implementação, relatório de testes, decisão arquitetural ou amostra de trabalho equivalente e inspecionável.",
    },
    capabilities,
    acceptanceChecklist,
    suggestedVerification: [
      {
        en: "Run the relevant automated checks and preserve the result alongside the artifact.",
        "pt-BR": "Execute as verificações automatizadas relevantes e preserve o resultado junto do artefato.",
      },
      {
        en: "Link the exact files, commit, or pull request that supports each capability claim.",
        "pt-BR": "Vincule os arquivos, commit ou pull request exatos que sustentam cada reivindicação de capacidade.",
      },
      {
        en: "Record one meaningful trade-off, failure path, or boundary you verified.",
        "pt-BR": "Registre um trade-off, caminho de falha ou limite relevante que você verificou.",
      },
    ],
  };
}

function assertHttpUrl(value: string): void {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Portfolio evidence repository URL must be a valid URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Portfolio evidence repository URL must use HTTP or HTTPS");
  }
}

export function createPortfolioEvidenceRecords(
  contract: PortfolioEvidenceContract,
  input: PortfolioEvidenceInput,
): readonly EvidenceRecord[] {
  const summary = input.summary.trim();
  if (!summary) throw new Error("Portfolio evidence summary is required");

  const completed = new Set(input.completedChecklistIds);
  const missingChecklist = contract.acceptanceChecklist.find((item) => !completed.has(item.id));
  if (missingChecklist) {
    throw new Error(`Portfolio evidence checklist is incomplete: ${missingChecklist.id}`);
  }

  const sourceUrl = input.repositoryUrl?.trim() || undefined;
  if (sourceUrl) assertHttpUrl(sourceUrl);
  const observedAt = input.observedAt ?? new Date().toISOString();
  if (!Number.isFinite(Date.parse(observedAt))) {
    throw new Error("Portfolio evidence requires a valid observed time");
  }

  return contract.capabilities.map((capability) => ({
    id: `evidence:portfolio:${contract.milestoneId}:${capability.competencyId}:${observedAt}`,
    competencyId: capability.competencyId,
    class: "E4",
    sourceType: "portfolio",
    trust: "external-unverified",
    observedAt,
    summary,
    ...(sourceUrl ? { sourceUrl } : {}),
    demonstratedLevel: capability.targetLevel,
    criterionIds: capability.criterionIds,
  }));
}

export function addEvidence(
  profile: CareerProfile,
  evidenceRecord: EvidenceRecord,
): CareerProfile {
  if (profile.evidence.some((record) => record.id === evidenceRecord.id)) {
    throw new Error(`Duplicate evidence id: ${evidenceRecord.id}`);
  }
  if (evidenceRecord.sourceType !== "portfolio") {
    throw new Error("Career portfolio evidence must use sourceType portfolio");
  }
  const definition = competencyDefinition(evidenceRecord.competencyId);
  if (!Number.isFinite(Date.parse(evidenceRecord.observedAt))) {
    throw new Error("Portfolio evidence requires a valid observed time");
  }

  const evidence = [...profile.evidence, evidenceRecord];
  const derived = deriveCompetencyState(
    definition,
    evidence,
    new Date(evidenceRecord.observedAt),
  );
  const existingIndex = profile.competencies.findIndex(
    (state) => state.competencyId === definition.id,
  );
  const competencies = [...profile.competencies];
  if (existingIndex === -1) competencies.push(derived);
  else competencies[existingIndex] = derived;

  const updatedProfile: CareerProfile = {
    ...profile,
    competencies,
    evidence,
    updatedAt: evidenceRecord.observedAt,
  };
  const { roadmap, decisionRecord } = recalculateRoadmap(
    updatedProfile,
    "portfolio-evidence",
  );

  return {
    ...updatedProfile,
    roadmap,
    decisionRecords: decisionRecord
      ? [...updatedProfile.decisionRecords, decisionRecord]
      : updatedProfile.decisionRecords,
  };
}
