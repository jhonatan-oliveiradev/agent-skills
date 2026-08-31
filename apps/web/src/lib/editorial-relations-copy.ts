import type { Locale } from "./locales";

interface EditorialRelationsCopy {
  readonly partOfSystems: string;
  readonly partOfSystemsSummary: string;
  readonly usedInEvidence: string;
  readonly usedInEvidenceSummary: string;
  readonly inspectReport: string;
  readonly relatedEvidence: string;
  readonly relatedEvidenceSummary: string;
  readonly relatedSystems: string;
  readonly relatedSystemsSummary: string;
  readonly methodOverlap: string;
  readonly overlapDisclaimer: string;
}

export const editorialRelationsCopy = {
  en: {
    partOfSystems: "Part of systems",
    partOfSystemsSummary: "Curated systems that canonically include this method.",
    usedInEvidence: "Used in evidence",
    usedInEvidenceSummary:
      "Reports that explicitly list this method among the applied methods.",
    inspectReport: "Inspect report",
    relatedEvidence: "Evidence using methods from this system",
    relatedEvidenceSummary:
      "These reports explicitly use one or more methods contained in this system.",
    relatedSystems: "Related systems",
    relatedSystemsSummary:
      "This report uses methods that canonically belong to these systems.",
    methodOverlap: "METHOD OVERLAP",
    overlapDisclaimer: "Method overlap only — not proof that the pack was used as a unit.",
  },
  "pt-BR": {
    partOfSystems: "Parte de sistemas",
    partOfSystemsSummary: "Sistemas curados que incluem canonicamente este método.",
    usedInEvidence: "Usado em evidências",
    usedInEvidenceSummary:
      "Relatórios que listam explicitamente este método entre os métodos aplicados.",
    inspectReport: "Inspecionar relatório",
    relatedEvidence: "Evidências que usam métodos deste sistema",
    relatedEvidenceSummary:
      "Estes relatórios usam explicitamente um ou mais métodos contidos neste sistema.",
    relatedSystems: "Sistemas relacionados",
    relatedSystemsSummary:
      "Este relatório usa métodos que pertencem canonicamente a estes sistemas.",
    methodOverlap: "SOBREPOSIÇÃO DE MÉTODOS",
    overlapDisclaimer:
      "A relação é apenas sobreposição de métodos — não é prova de que o pacote foi usado como uma unidade.",
  },
} as const satisfies Readonly<Record<Locale, EditorialRelationsCopy>>;

export function formatMethodOverlap(locale: Locale, matching: number, total: number) {
  return locale === "pt-BR"
    ? `${matching} / ${total} métodos representados`
    : `${matching} / ${total} methods represented`;
}

export function formatMethodCount(locale: Locale, count: number) {
  if (locale === "pt-BR") return `${count} ${count === 1 ? "método" : "métodos"}`;
  return `${count} ${count === 1 ? "method" : "methods"}`;
}

export function formatSystemStatus(locale: Locale, status: "active" | "planned") {
  if (locale === "pt-BR") return status === "active" ? "ativo" : "planejado";
  return status;
}
