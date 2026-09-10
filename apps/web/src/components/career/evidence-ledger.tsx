"use client";

import { addEvidence, buildPortfolioEvidenceContract } from "@/lib/career/portfolio-evidence";
import { buildRoadmap } from "@/lib/career/roadmap-engine";
import { getRoleMap } from "@/lib/career/role-maps";
import type {
  CareerProfile,
  EvidenceRecord,
  EvidenceTrust,
} from "@/lib/career/types";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";
import { CareerSectionGuidance } from "./career-section-guidance";
import { EvidenceForm } from "./evidence-form";

const copy = {
  en: {
    eyebrow: "Career Lab / evidence",
    title: "Professional evidence",
    ledgerTitle: "Evidence Ledger",
    summary:
      "Record concrete artifacts, keep provenance visible, and let the competency engine decide what they actually support.",
    empty: "No evidence has been recorded yet.",
    noProfile: "Create a Career Profile before recording evidence.",
    noFocus: "Generate a roadmap before creating a portfolio evidence contract.",
    loading: "Loading evidence…",
    error: "Career evidence could not be loaded from local storage.",
    source: "Open source",
    trustLabel: "Trust",
    dateLabel: "Observed",
    guidanceEyebrow: "Before you record",
    guidanceTitle: "Evidence is an inspectable artifact tied to your current roadmap focus",
    guidanceBody:
      "Start with something concrete — a repository change, pull request, or test report — and record where it came from. Provenance keeps the claim inspectable instead of turning it into an unsupported self-report.",
    trust: {
      "local-deterministic": "Locally verified",
      "external-unverified": "External — unverified",
      "user-claimed": "User claimed",
    } satisfies Record<EvidenceTrust, string>,
    sourceTypes: {
      "self-report": "Self-report",
      assessment: "Assessment",
      portfolio: "Portfolio",
      practice: "Practice",
    },
  },
  "pt-BR": {
    eyebrow: "Career Lab / evidências",
    title: "Evidência profissional",
    ledgerTitle: "Ledger de Evidências",
    summary:
      "Registre artefatos concretos, mantenha a proveniência visível e deixe o engine de competências decidir o que eles realmente sustentam.",
    empty: "Nenhuma evidência foi registrada ainda.",
    noProfile: "Crie um Career Profile antes de registrar evidências.",
    noFocus: "Gere um roadmap antes de criar um contrato de evidência de portfólio.",
    loading: "Carregando evidências…",
    error: "As evidências de carreira não puderam ser carregadas do armazenamento local.",
    source: "Abrir fonte",
    trustLabel: "Confiança da fonte",
    dateLabel: "Observado em",
    guidanceEyebrow: "Antes de registrar",
    guidanceTitle: "Evidência é um artefato inspecionável ligado ao foco atual do seu roadmap",
    guidanceBody:
      "Comece por algo concreto — uma alteração de repositório, pull request ou relatório de testes — e registre de onde veio. A proveniência mantém a afirmação inspecionável em vez de transformá-la em uma autodeclaração sem suporte.",
    trust: {
      "local-deterministic": "Verificado localmente",
      "external-unverified": "Externo — não verificado",
      "user-claimed": "Declarado pelo usuário",
    } satisfies Record<EvidenceTrust, string>,
    sourceTypes: {
      "self-report": "Autoavaliação",
      assessment: "Avaliação",
      portfolio: "Portfólio",
      practice: "Prática",
    },
  },
} as const;

export function EvidenceLedger({
  evidence,
  locale,
}: Readonly<{ evidence: readonly EvidenceRecord[]; locale: Locale }>) {
  const localized = copy[locale];

  if (evidence.length === 0) {
    return <p className="career-evidence-ledger__empty">{localized.empty}</p>;
  }

  const ordered = [...evidence].sort(
    (left, right) => Date.parse(right.observedAt) - Date.parse(left.observedAt),
  );

  return (
    <div className="career-evidence-ledger" aria-label={localized.ledgerTitle}>
      {ordered.map((record) => (
        <article key={record.id} className="career-evidence-record">
          <header>
            <code>{record.id}</code>
            <span>
              {record.class} · {localized.sourceTypes[record.sourceType]}
            </span>
          </header>
          <h3>{record.competencyId}</h3>
          <p>{record.summary}</p>
          <dl>
            <div>
              <dt>{localized.trustLabel}</dt>
              <dd>{localized.trust[record.trust]}</dd>
            </div>
            <div>
              <dt>{localized.dateLabel}</dt>
              <dd>{record.observedAt.slice(0, 10)}</dd>
            </div>
          </dl>
          {record.sourceUrl ? (
            <a href={record.sourceUrl} target="_blank" rel="noreferrer noopener">
              {localized.source}
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function EvidenceLedgerSurface({ locale }: Readonly<{ locale: Locale }>) {
  const { profile, status, updateProfile } = useCareerProfile();
  const localized = copy[locale];

  if (status === "hydrating") return <p role="status">{localized.loading}</p>;
  if (status === "error") return <p role="alert">{localized.error}</p>;
  if (!profile) return <p className="career-evidence-workspace__empty">{localized.noProfile}</p>;

  const roleId = profile.targetRoles[0];
  if (!roleId) return <p className="career-evidence-workspace__empty">{localized.noProfile}</p>;

  const derivedRoadmap = buildRoadmap(profile, getRoleMap(roleId));
  const effectiveProfile: CareerProfile = { ...profile, roadmap: derivedRoadmap };
  const currentFocus = derivedRoadmap.currentFocusMilestoneId;
  const contract = currentFocus
    ? buildPortfolioEvidenceContract(effectiveProfile, currentFocus)
    : null;

  async function handleEvidence(records: readonly EvidenceRecord[]) {
    await updateProfile((current) => {
      const currentRoleId = current.targetRoles[0];
      if (!currentRoleId) return current;
      let next: CareerProfile = {
        ...current,
        roadmap: buildRoadmap(current, getRoleMap(currentRoleId)),
      };
      for (const record of records) {
        next = addEvidence(next, record);
      }
      return next;
    });
  }

  return (
    <section className="career-evidence-workspace">
      <header className="career-evidence-workspace__header">
        <p className="career-lab__eyebrow">{localized.eyebrow}</p>
        <h1>{localized.title}</h1>
        <p>{localized.summary}</p>
      </header>

      {profile.evidence.length === 0 ? (
        <CareerSectionGuidance
          eyebrow={localized.guidanceEyebrow}
          title={localized.guidanceTitle}
          body={localized.guidanceBody}
        />
      ) : null}

      <div className="career-evidence-workspace__grid">
        <div>
          {contract ? (
            <EvidenceForm locale={locale} contract={contract} onSubmit={handleEvidence} />
          ) : (
            <p className="career-evidence-workspace__empty">{localized.noFocus}</p>
          )}
        </div>
        <section aria-labelledby="career-evidence-ledger-title">
          <h2 id="career-evidence-ledger-title">{localized.ledgerTitle}</h2>
          <EvidenceLedger locale={locale} evidence={profile.evidence} />
        </section>
      </div>
    </section>
  );
}
