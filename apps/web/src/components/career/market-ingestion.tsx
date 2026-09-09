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
    importHint: "Import a market-analysis.json artifact created by the Developer Career Skill or another compatible runtime.",
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
    importHint: "Importe um market-analysis.json criado pela Skill Developer Career ou por outro runtime compatível.",
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
      </form>

      <div className="career-market-ingestion__import">
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
      </div>

      {message ? (
        <p role={status === "error" ? "alert" : "status"} className="career-market-ingestion__status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
