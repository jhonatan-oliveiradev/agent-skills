"use client";

import { useMemo, useState } from "react";
import { analyzeJobFit, type JobFitAnalysis } from "@/lib/career/job-fit";
import {
  applyMarketSample,
  buildMarketSample,
  deduplicateJobPostings,
} from "@/lib/career/market";
import type {
  CareerProfile,
  JobCapabilitySignal,
  MarketSample,
  NormalizedJobPosting,
  StructuralRequirement,
} from "@/lib/career/types";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";
import { MarketIngestion } from "./market-ingestion";

const copy = {
  en: {
    eyebrow: "Market Intelligence / local analysis",
    summary:
      "Normalize a small market sample, inspect explicit demand and hard blockers, then let market relevance adjust roadmap priority without changing demonstrated proficiency.",
    noProfile: "Create a Career Profile before analyzing market demand.",
    sampleTitle: "Sample health",
    postings: "Unique postings",
    companies: "Companies",
    sources: "Sources",
    deduplicated: "Duplicates removed",
    fresh: "Fresh ≤ 7 days",
    recent: "Recent ≤ 30 days",
    historical: "Historical > 30 days",
    unknown: "Unknown date",
    demandTitle: "Demand provenance — explicit / inferred",
    noSignals: "No capability aliases were found in this sample.",
    fitTitle: "Job fit",
    capabilityGaps: "Capability gaps",
    evidenceGaps: "Evidence gaps",
    structuralGaps: "Structural gaps",
    hardConstraints: "Hard constraints",
    noGap: "None detected",
    matches: "Matches",
    readiness: "Secondary readiness",
    save: "Save market sample",
    saving: "Saving…",
    saved: "Market sample saved. Roadmap priority was recalculated; competency levels were retained.",
    latest: "Latest saved sample",
    latestSummary: (count: number) => `${count} unique postings are stored in the latest sample.`,
    verdicts: {
      "strong-target": "Strong target",
      "stretch-target": "Stretch target",
      "low-relevance": "Low relevance",
      blocked: "Blocked",
    },
  },
  "pt-BR": {
    eyebrow: "Inteligência de mercado / análise local",
    summary:
      "Normalize uma pequena amostra de mercado, inspecione demanda explícita e bloqueadores rígidos e deixe a relevância ajustar a prioridade do roadmap sem alterar proficiência demonstrada.",
    noProfile: "Crie um Career Profile antes de analisar a demanda de mercado.",
    sampleTitle: "Saúde da amostra",
    postings: "Vagas únicas",
    companies: "Empresas",
    sources: "Fontes",
    deduplicated: "Duplicatas removidas",
    fresh: "Recentes ≤ 7 dias",
    recent: "Recentes ≤ 30 dias",
    historical: "Históricas > 30 dias",
    unknown: "Data desconhecida",
    demandTitle: "Proveniência da demanda — explícita / inferida",
    noSignals: "Nenhum alias de capacidade foi encontrado nesta amostra.",
    fitTitle: "Fit com as vagas",
    capabilityGaps: "Gaps de capacidade",
    evidenceGaps: "Gaps de evidência",
    structuralGaps: "Gaps estruturais",
    hardConstraints: "Restrições rígidas",
    noGap: "Nenhum detectado",
    matches: "Matches",
    readiness: "Readiness secundário",
    save: "Salvar amostra de mercado",
    saving: "Salvando…",
    saved: "Amostra salva. A prioridade do roadmap foi recalculada; os níveis de competência foram preservados.",
    latest: "Última amostra salva",
    latestSummary: (count: number) => `${count} vagas únicas estão armazenadas na amostra mais recente.`,
    verdicts: {
      "strong-target": "Alvo forte",
      "stretch-target": "Alvo de crescimento",
      "low-relevance": "Baixa relevância",
      blocked: "Bloqueado",
    },
  },
} as const;

function uniqueCapabilitySignals(
  analyses: readonly JobFitAnalysis[],
  key: "capabilityGaps" | "evidenceGaps",
): readonly JobCapabilitySignal[] {
  const unique = new Map<string, JobCapabilitySignal>();
  for (const analysis of analyses) {
    for (const signal of analysis[key]) {
      if (!unique.has(signal.competencyId)) unique.set(signal.competencyId, signal);
    }
  }
  return [...unique.values()];
}

function uniqueRequirements(
  analyses: readonly JobFitAnalysis[],
  key: "structuralGaps" | "hardConstraints",
): readonly StructuralRequirement[] {
  const unique = new Map<string, StructuralRequirement>();
  for (const analysis of analyses) {
    for (const requirement of analysis[key]) {
      const id = `${requirement.kind}:${requirement.label.toLowerCase()}`;
      if (!unique.has(id)) unique.set(id, requirement);
    }
  }
  return [...unique.values()];
}

function GapList({
  items,
  empty,
}: Readonly<{ items: readonly { readonly competencyId: string; readonly label: string }[]; empty: string }>) {
  if (items.length === 0) return <p className="career-market-analysis__empty">{empty}</p>;
  return (
    <ul className="career-market-analysis__list">
      {items.map((item) => (
        <li key={item.competencyId}>
          <code>{item.competencyId}</code>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function RequirementList({
  items,
  empty,
}: Readonly<{ items: readonly StructuralRequirement[]; empty: string }>) {
  if (items.length === 0) return <p className="career-market-analysis__empty">{empty}</p>;
  return (
    <ul className="career-market-analysis__list">
      {items.map((item) => (
        <li key={`${item.kind}:${item.label}`}>
          <code>{item.kind}</code>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function MarketAnalysis({
  locale,
  profile,
  postings,
  onSave,
}: Readonly<{
  locale: Locale;
  profile: CareerProfile;
  postings: readonly NormalizedJobPosting[];
  onSave?: (sample: MarketSample) => void | Promise<void>;
}>) {
  const localized = copy[locale];
  const uniquePostings = useMemo(() => deduplicateJobPostings(postings), [postings]);
  const sample = useMemo(() => {
    const targetRole = profile.targetRoles[0];
    const targetMarket = profile.targetMarkets[0];
    return buildMarketSample(postings, {
      ...(targetRole ? { targetRole } : {}),
      ...(targetMarket ? { targetMarket } : {}),
    });
  }, [postings, profile.targetMarkets, profile.targetRoles]);
  const analyses = useMemo(
    () => uniquePostings.map((posting) => analyzeJobFit(profile, posting)),
    [profile, uniquePostings],
  );
  const capabilityGaps = uniqueCapabilitySignals(analyses, "capabilityGaps");
  const evidenceGaps = uniqueCapabilitySignals(analyses, "evidenceGaps");
  const structuralGaps = uniqueRequirements(analyses, "structuralGaps");
  const hardConstraints = uniqueRequirements(analyses, "hardConstraints");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!onSave || saving) return;
    setSaving(true);
    try {
      await onSave(sample);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="career-market-analysis" aria-labelledby="career-market-analysis-title">
      <header>
        <p className="career-lab__eyebrow">{localized.fitTitle}</p>
        <h2 id="career-market-analysis-title">{localized.sampleTitle}</h2>
      </header>

      <dl className="career-market-analysis__health">
        <div><dt>{localized.postings}</dt><dd>{sample.postingCount}</dd></div>
        <div><dt>{localized.companies}</dt><dd>{sample.distinctCompanyCount}</dd></div>
        <div><dt>{localized.sources}</dt><dd>{sample.distinctSourceCount}</dd></div>
        <div><dt>{localized.deduplicated}</dt><dd>{sample.deduplicatedCount ?? 0}</dd></div>
        <div><dt>{localized.fresh}</dt><dd>{sample.freshCount ?? 0}</dd></div>
        <div><dt>{localized.recent}</dt><dd>{sample.recentCount ?? 0}</dd></div>
        <div><dt>{localized.historical}</dt><dd>{sample.historicalCount ?? 0}</dd></div>
        <div><dt>{localized.unknown}</dt><dd>{sample.unknownDateCount ?? 0}</dd></div>
      </dl>

      <section className="career-market-analysis__demand">
        <h3>{localized.demandTitle}</h3>
        {sample.signals?.length ? (
          <ul>
            {sample.signals.map((signal) => (
              <li key={signal.competencyId}>
                <code>{signal.competencyId}</code>
                <span>E {signal.explicitCount} · I {signal.inferredCount} · {signal.postingCount} / {sample.postingCount}</span>
                <small>market-derived</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>{localized.noSignals}</p>
        )}
      </section>

      <div className="career-market-analysis__gaps">
        <section>
          <h3>{localized.capabilityGaps}</h3>
          <GapList items={capabilityGaps} empty={localized.noGap} />
        </section>
        <section>
          <h3>{localized.evidenceGaps}</h3>
          <GapList items={evidenceGaps} empty={localized.noGap} />
        </section>
        <section>
          <h3>{localized.structuralGaps}</h3>
          <RequirementList items={structuralGaps} empty={localized.noGap} />
        </section>
        <section>
          <h3>{localized.hardConstraints}</h3>
          <RequirementList items={hardConstraints} empty={localized.noGap} />
        </section>
      </div>

      <section className="career-market-analysis__fits">
        <h3>{localized.fitTitle}</h3>
        <ol>
          {uniquePostings.map((posting, index) => {
            const analysis = analyses[index];
            if (!analysis) return null;
            return (
              <li key={posting.id}>
                <div>
                  <strong>{posting.title}</strong>
                  <span>{posting.company}</span>
                </div>
                <div>
                  <span>{localized.verdicts[analysis.verdict]}</span>
                  <span>{localized.readiness}: {analysis.readinessPercentage}%</span>
                  <span>{localized.matches}: {analysis.matches.length}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {onSave ? (
        <button type="button" onClick={() => void save()} disabled={saving || sample.postingCount === 0}>
          {saving ? localized.saving : localized.save}
        </button>
      ) : null}
    </section>
  );
}

export function MarketIntelligenceSurface({ locale }: Readonly<{ locale: Locale }>) {
  const localized = copy[locale];
  const title = locale === "pt-BR" ? "Inteligência de mercado" : "Market Intelligence";
  const { profile, status, updateProfile } = useCareerProfile();
  const [postings, setPostings] = useState<readonly NormalizedJobPosting[]>([]);
  const [saved, setSaved] = useState(false);

  if (status === "hydrating") return <p role="status">…</p>;
  if (status === "error" || !profile) {
    return (
      <div className="career-market-workspace career-market-workspace--empty">
        <header className="career-market-workspace__header">
          <p className="career-lab__eyebrow">{localized.eyebrow}</p>
          <h1>{title}</h1>
          <p>{localized.summary}</p>
        </header>
        <p role="alert" className="career-market-workspace__empty">
          {localized.noProfile}
        </p>
      </div>
    );
  }

  const latestSample = [...profile.marketSamples].sort((a, b) =>
    b.capturedAt.localeCompare(a.capturedAt),
  )[0];

  async function saveSample(sample: MarketSample) {
    await updateProfile((current) => applyMarketSample(current, sample));
    setSaved(true);
    setPostings([]);
  }

  return (
    <div className="career-market-workspace">
      <header className="career-market-workspace__header">
        <p className="career-lab__eyebrow">{localized.eyebrow}</p>
        <h1>{title}</h1>
        <p>{localized.summary}</p>
      </header>

      <MarketIngestion
        locale={locale}
        onIngest={(incoming) => {
          setSaved(false);
          setPostings((current) => [...current, ...incoming]);
        }}
      />

      {postings.length > 0 ? (
        <MarketAnalysis
          locale={locale}
          profile={profile}
          postings={postings}
          onSave={saveSample}
        />
      ) : null}

      {saved ? <p role="status" className="career-market-workspace__saved">{localized.saved}</p> : null}

      {latestSample ? (
        <aside className="career-market-workspace__latest">
          <p className="career-lab__eyebrow">{localized.latest}</p>
          <p>{localized.latestSummary(latestSample.postingCount)}</p>
        </aside>
      ) : null}
    </div>
  );
}
