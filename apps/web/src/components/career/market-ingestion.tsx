"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  normalizeJobPosting,
  parseMarketAnalysisArtifact,
} from "@/lib/career/market";
import type { NormalizedJobPosting } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";

const copy = {
  en: {
    eyebrow: "Market input",
    title: "Add a real job posting",
    summary:
      "Posting text is untrusted data. Career Lab only extracts deterministic signals that are explicitly present; imported inferred signals remain external-unverified.",
    identityEyebrow: "Job identity",
    identitySummary: "Set the role and company once, then choose the ingestion method that matches the source you have.",
    pasteMethod: "01 / Paste job description — primary",
    pasteMethodSummary: "Best default. Paste the complete job text so Career Lab can inspect exactly what you supplied.",
    fetchMethod: "02 / Fetch by URL — secondary convenience",
    fetchMethodSummary: "Use when the posting is publicly reachable. Browser fetching may still be blocked by the source site.",
    importMethod: "03 / Import compatible analysis JSON — secondary expert path",
    importMethodSummary: "Use a market-analysis.json produced by the Developer Career Skill or another compatible runtime.",
    titleLabel: "Job title",
    companyLabel: "Company",
    urlLabel: "Posting URL",
    urlHint: "Optional for pasted descriptions. Browser fetching can fail because of CORS, authentication or anti-bot controls.",
    descriptionLabel: "Job description",
    descriptionPlaceholder: "Paste the complete posting snapshot here…",
    pasteAction: "Analyze pasted description",
    fetchAction: "Fetch URL",
    fetching: "Fetching…",
    importLabel: "Import market analysis",
    importHint: "Imported inferred signals remain external-unverified until supported by inspectable evidence.",
    pasteSuccess: "Posting normalized locally. Explicit signals are ready for comparison.",
    fetchSuccess: "Posting fetched and normalized locally.",
    importSuccess: "Market analysis imported as external-unverified agent data.",
    invalid: "Provide a title, company and valid posting content before analysis.",
    invalidUrl: "Enter a valid HTTP or HTTPS posting URL.",
    importFailed: "The market-analysis artifact is invalid and was not imported.",
    fallback: "Paste the job description or import a market-analysis artifact.",
  },
  "pt-BR": {
    eyebrow: "Entrada de mercado",
    title: "Adicione uma vaga real",
    summary:
      "O texto da vaga é dado não confiável. O Career Lab extrai apenas sinais determinísticos explicitamente presentes; sinais inferidos importados permanecem externos e não verificados.",
    identityEyebrow: "Identidade da vaga",
    identitySummary: "Defina função e empresa uma vez e escolha o método de entrada de acordo com a fonte que você tem.",
    pasteMethod: "01 / Colar descrição da vaga — principal",
    pasteMethodSummary: "Caminho recomendado. Cole o texto completo para que o Career Lab inspecione exatamente o conteúdo fornecido.",
    fetchMethod: "02 / Buscar pela URL — conveniência secundária",
    fetchMethodSummary: "Use quando a vaga estiver acessível publicamente. O navegador ainda pode ser bloqueado pelo site de origem.",
    importMethod: "03 / Importar JSON de análise compatível — caminho avançado secundário",
    importMethodSummary: "Use um market-analysis.json produzido pela Skill Developer Career ou por outro runtime compatível.",
    titleLabel: "Título da vaga",
    companyLabel: "Empresa",
    urlLabel: "URL da vaga",
    urlHint: "Opcional para textos colados. O fetch no navegador pode falhar por CORS, autenticação ou controles anti-bot.",
    descriptionLabel: "Descrição da vaga",
    descriptionPlaceholder: "Cole aqui o snapshot completo da vaga…",
    pasteAction: "Analisar descrição colada",
    fetchAction: "Buscar URL",
    fetching: "Buscando…",
    importLabel: "Importar análise de mercado",
    importHint: "Sinais inferidos importados permanecem externos e não verificados até receberem suporte de evidência inspecionável.",
    pasteSuccess: "Vaga normalizada localmente. Os sinais explícitos estão prontos para comparação.",
    fetchSuccess: "Vaga buscada e normalizada localmente.",
    importSuccess: "Análise de mercado importada como dado externo não verificado.",
    invalid: "Informe título, empresa e conteúdo válido da vaga antes da análise.",
    invalidUrl: "Informe uma URL HTTP ou HTTPS válida para a vaga.",
    importFailed: "O artefato market-analysis é inválido e não foi importado.",
    fallback: "Cole a descrição da vaga ou importe um artefato market-analysis.",
  },
} as const;

type MarketIngestionStatus = "idle" | "working" | "success" | "error";

function normalizedHttpUrl(value: string): string | null {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export function MarketIngestion({
  locale,
  onIngest,
}: Readonly<{
  locale: Locale;
  onIngest: (postings: readonly NormalizedJobPosting[]) => void | Promise<void>;
}>) {
  const localized = copy[locale];
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<MarketIngestionStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  function setResult(nextStatus: MarketIngestionStatus, nextMessage: string | null) {
    setStatus(nextStatus);
    setMessage(nextMessage);
  }

  async function handlePaste(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !company.trim() || !description.trim()) {
      setResult("error", localized.invalid);
      return;
    }

    try {
      const optionalUrl = url.trim() ? normalizedHttpUrl(url) : null;
      if (url.trim() && !optionalUrl) {
        setResult("error", localized.invalidUrl);
        return;
      }
      const posting = normalizeJobPosting({
        title,
        company,
        source: {
          type: "pasted",
          ...(optionalUrl ? { url: optionalUrl } : {}),
          capturedAt: new Date().toISOString(),
        },
        rawSnapshot: description,
      });
      await onIngest([posting]);
      setResult("success", localized.pasteSuccess);
    } catch {
      setResult("error", localized.invalid);
    }
  }

  async function handleFetch() {
    if (!title.trim() || !company.trim()) {
      setResult("error", localized.invalid);
      return;
    }
    const resolvedUrl = normalizedHttpUrl(url);
    if (!resolvedUrl) {
      setResult("error", localized.invalidUrl);
      return;
    }

    setResult("working", null);
    try {
      const response = await fetch(resolvedUrl, {
        credentials: "omit",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const snapshot = await response.text();
      if (!snapshot.trim()) throw new Error("Empty posting response");
      const posting = normalizeJobPosting({
        title,
        company,
        source: {
          type: "url",
          url: resolvedUrl,
          capturedAt: new Date().toISOString(),
        },
        rawSnapshot: snapshot,
      });
      await onIngest([posting]);
      setDescription(snapshot);
      setResult("success", localized.fetchSuccess);
    } catch {
      setResult("error", localized.fallback);
    }
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setResult("working", null);
    try {
      const artifact = parseMarketAnalysisArtifact(JSON.parse(await file.text()));
      await onIngest(artifact.postings);
      setResult("success", localized.importSuccess);
    } catch {
      setResult("error", localized.importFailed);
    } finally {
      input.value = "";
    }
  }

  return (
    <section className="career-market-ingestion" aria-labelledby="career-market-ingestion-title">
      <header>
        <p className="career-lab__eyebrow">{localized.eyebrow}</p>
        <h2 id="career-market-ingestion-title">{localized.title}</h2>
        <p>{localized.summary}</p>
      </header>

      <form onSubmit={handlePaste}>
        <div className="career-market-ingestion__identity-block">
          <div className="career-market-ingestion__identity-copy">
            <p className="career-lab__eyebrow">{localized.identityEyebrow}</p>
            <p>{localized.identitySummary}</p>
          </div>
          <div className="career-market-ingestion__identity">
            <label>
              <span>{localized.titleLabel}</span>
              <input
                aria-label={localized.titleLabel}
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}
              />
            </label>
            <label>
              <span>{localized.companyLabel}</span>
              <input
                aria-label={localized.companyLabel}
                value={company}
                onChange={(event) => setCompany(event.currentTarget.value)}
              />
            </label>
          </div>
        </div>

        <div className="career-market-ingestion__methods">
          <section
            className="career-market-ingestion__method career-market-ingestion__method--primary"
            data-testid="career-market-ingestion-method"
            data-priority="primary"
          >
            <header>
              <h3>{localized.pasteMethod}</h3>
              <p>{localized.pasteMethodSummary}</p>
            </header>
            <label className="career-market-ingestion__field">
              <span>{localized.descriptionLabel}</span>
              <textarea
                aria-label={localized.descriptionLabel}
                rows={10}
                value={description}
                placeholder={localized.descriptionPlaceholder}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
            </label>
            <button type="submit" disabled={status === "working"}>{localized.pasteAction}</button>
          </section>

          <section
            className="career-market-ingestion__method"
            data-testid="career-market-ingestion-method"
            data-priority="secondary"
          >
            <header>
              <h3>{localized.fetchMethod}</h3>
              <p>{localized.fetchMethodSummary}</p>
            </header>
            <label className="career-market-ingestion__field">
              <span>{localized.urlLabel}</span>
              <input
                aria-label={localized.urlLabel}
                type="url"
                value={url}
                onChange={(event) => setUrl(event.currentTarget.value)}
              />
              <small>{localized.urlHint}</small>
            </label>
            <div className="career-market-ingestion__url-action">
              <button type="button" onClick={() => void handleFetch()} disabled={status === "working"}>
                {status === "working" ? localized.fetching : localized.fetchAction}
              </button>
            </div>
          </section>
        </div>
      </form>

      <section
        className="career-market-ingestion__method career-market-ingestion__import"
        data-testid="career-market-ingestion-method"
        data-priority="secondary"
      >
        <header>
          <h3>{localized.importMethod}</h3>
          <p>{localized.importMethodSummary}</p>
        </header>
        <label>
          <span>{localized.importLabel}</span>
          <input
            aria-label={localized.importLabel}
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleImport(event)}
          />
        </label>
        <p>{localized.importHint}</p>
      </section>

      {message ? (
        <p role={status === "error" ? "alert" : "status"} className="career-market-ingestion__status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
