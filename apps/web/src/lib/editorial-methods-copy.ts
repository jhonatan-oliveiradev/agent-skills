import type { Locale } from "./locales";

interface EditorialMethodsCopy {
  readonly archiveLabel: string;
  readonly archiveTitle: string;
  readonly archiveSummary: string;
  readonly methodsMetric: string;
  readonly packsMetric: string;
  readonly categoriesMetric: string;
  readonly versionMetric: string;
  readonly filterLabel: string;
  readonly categoryLabels: Readonly<Record<string, string>>;
  readonly methodLabel: string;
  readonly onThisMethod: string;
  readonly promptLabel: string;
  readonly technicalNotes: string;
}

export const editorialMethodsCopy = {
  en: {
    archiveLabel: "METHODS / ARCHIVE",
    archiveTitle: "Methods for agents that need to work better.",
    archiveSummary:
      "A versioned library of working methods for design, frontend, motion, delivery, backend, data, architecture, engineering, quality, testing, and agent practice — organized for comparison before installation.",
    methodsMetric: "METHODS",
    packsMetric: "PACKS",
    categoriesMetric: "DOMAINS",
    versionMetric: "VERSION",
    filterLabel: "Filter the archive",
    categoryLabels: {
      "backend-data": "Backend & data",
      "architecture-engineering": "Architecture & engineering",
      "quality-testing": "Quality & testing",
    },
    methodLabel: "METHOD",
    onThisMethod: "On this method",
    promptLabel: "PROMPT",
    technicalNotes: "TECHNICAL NOTES",
  },
  "pt-BR": {
    archiveLabel: "MÉTODOS / ARQUIVO",
    archiveTitle: "Métodos para agentes que precisam trabalhar melhor.",
    archiveSummary:
      "Uma biblioteca versionada de métodos de trabalho para design, frontend, motion, delivery, backend, dados, arquitetura, engenharia, qualidade, testes e prática com agentes — organizada para comparação antes da instalação.",
    methodsMetric: "MÉTODOS",
    packsMetric: "PACOTES",
    categoriesMetric: "DOMÍNIOS",
    versionMetric: "VERSÃO",
    filterLabel: "Filtrar o arquivo",
    categoryLabels: {
      "backend-data": "Backend e dados",
      "architecture-engineering": "Arquitetura e engenharia",
      "quality-testing": "Qualidade e testes",
    },
    methodLabel: "MÉTODO",
    onThisMethod: "Neste método",
    promptLabel: "PROMPT",
    technicalNotes: "NOTAS TÉCNICAS",
  },
} as const satisfies Readonly<Record<Locale, EditorialMethodsCopy>>;
