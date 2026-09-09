"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  createPortfolioEvidenceRecords,
  type PortfolioEvidenceContract,
} from "@/lib/career/portfolio-evidence";
import type { EvidenceRecord, ProficiencyLevel } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";

const copy = {
  en: {
    eyebrow: "Evidence contract",
    problem: "Problem / artifact",
    capabilities: "Capabilities intended",
    checklist: "Acceptance checklist",
    verification: "Suggested verification",
    summary: "Evidence summary",
    summaryPlaceholder: "Describe what the artifact demonstrates and where the proof can be inspected.",
    repositoryUrl: "Repository URL (optional)",
    repositoryPlaceholder: "https://github.com/...",
    submit: "Record evidence",
    saving: "Recording…",
    saved: "Evidence recorded. Roadmap and competency confidence were recalculated.",
    invalid: "Review the evidence summary, source and checklist before recording this artifact.",
    levels: {
      foundation: "Foundation",
      developing: "Developing",
      proficient: "Proficient",
      advanced: "Advanced",
    } satisfies Record<ProficiencyLevel, string>,
  },
  "pt-BR": {
    eyebrow: "Contrato de evidência",
    problem: "Problema / artefato",
    capabilities: "Capacidades pretendidas",
    checklist: "Checklist de aceitação",
    verification: "Verificação sugerida",
    summary: "Resumo da evidência",
    summaryPlaceholder: "Descreva o que o artefato demonstra e onde a prova pode ser inspecionada.",
    repositoryUrl: "URL do repositório (opcional)",
    repositoryPlaceholder: "https://github.com/...",
    submit: "Registrar evidência",
    saving: "Registrando…",
    saved: "Evidência registrada. Roadmap e confiança das competências foram recalculados.",
    invalid: "Revise o resumo, a fonte e o checklist antes de registrar este artefato.",
    levels: {
      foundation: "Fundamentos",
      developing: "Em desenvolvimento",
      proficient: "Proficiente",
      advanced: "Avançado",
    } satisfies Record<ProficiencyLevel, string>,
  },
} as const;

export function EvidenceForm({
  contract,
  locale,
  onSubmit,
}: Readonly<{
  contract: PortfolioEvidenceContract;
  locale: Locale;
  onSubmit: (records: readonly EvidenceRecord[]) => void | Promise<void>;
}>) {
  const localized = copy[locale];
  const [summary, setSummary] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [completedIds, setCompletedIds] = useState<readonly string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  const allAcknowledged = useMemo(
    () => contract.acceptanceChecklist.every((item) => completedIds.includes(item.id)),
    [completedIds, contract.acceptanceChecklist],
  );

  function toggleChecklist(id: string, checked: boolean) {
    setCompletedIds((current) =>
      checked
        ? current.includes(id)
          ? current
          : [...current, id]
        : current.filter((candidate) => candidate !== id),
    );
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("saving");

    try {
      const records = createPortfolioEvidenceRecords(contract, {
        summary,
        repositoryUrl: repositoryUrl || undefined,
        completedChecklistIds: completedIds,
      });
      await onSubmit(records);
      setSummary("");
      setRepositoryUrl("");
      setCompletedIds([]);
      setStatus("saved");
    } catch {
      setStatus("idle");
      setError(localized.invalid);
    }
  }

  return (
    <form className="career-evidence-form" onSubmit={handleSubmit}>
      <header>
        <p className="career-lab__eyebrow">{localized.eyebrow}</p>
        <h2>{contract.title[locale]}</h2>
      </header>

      <section>
        <h3>{localized.problem}</h3>
        <p>{contract.problem[locale]}</p>
        <p>{contract.artifact[locale]}</p>
      </section>

      <section>
        <h3>{localized.capabilities}</h3>
        <ul className="career-evidence-form__capabilities">
          {contract.capabilities.map((capability) => (
            <li key={capability.competencyId}>
              <code>{capability.competencyId}</code>
              <span>{localized.levels[capability.targetLevel]}</span>
            </li>
          ))}
        </ul>
      </section>

      <fieldset>
        <legend>{localized.checklist}</legend>
        {contract.acceptanceChecklist.map((item) => (
          <label key={item.id}>
            <input
              type="checkbox"
              checked={completedIds.includes(item.id)}
              onChange={(event) => toggleChecklist(item.id, event.currentTarget.checked)}
            />
            <span>{item.label[locale]}</span>
          </label>
        ))}
      </fieldset>

      <section>
        <h3>{localized.verification}</h3>
        <ul>
          {contract.suggestedVerification.map((item) => (
            <li key={item.en}>{item[locale]}</li>
          ))}
        </ul>
      </section>

      <label className="career-evidence-form__field">
        <span>{localized.summary}</span>
        <textarea
          aria-label={localized.summary}
          rows={4}
          value={summary}
          placeholder={localized.summaryPlaceholder}
          onChange={(event) => {
            setSummary(event.currentTarget.value);
            setStatus("idle");
          }}
        />
      </label>

      <label className="career-evidence-form__field">
        <span>{localized.repositoryUrl}</span>
        <input
          aria-label={localized.repositoryUrl}
          type="url"
          value={repositoryUrl}
          placeholder={localized.repositoryPlaceholder}
          onChange={(event) => {
            setRepositoryUrl(event.currentTarget.value);
            setStatus("idle");
          }}
        />
      </label>

      {error ? <p role="alert">{error}</p> : null}
      {status === "saved" ? <p role="status">{localized.saved}</p> : null}

      <button type="submit" disabled={!summary.trim() || !allAcknowledged || status === "saving"}>
        {status === "saving" ? localized.saving : localized.submit}
      </button>
    </form>
  );
}
