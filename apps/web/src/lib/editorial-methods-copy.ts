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
}

export const editorialMethodsCopy = {
  en: {
    archiveLabel: "METHODS / ARCHIVE",
    archiveTitle: "Methods for agents that need to work better.",
    archiveSummary:
      "A versioned library of working methods for design, frontend, motion, delivery, and agent practice — organized for comparison before installation.",
    methodsMetric: "METHODS",
    packsMetric: "PACKS",
    categoriesMetric: "DOMAINS",
    versionMetric: "VERSION",
    filterLabel: "Filter the archive",
  },
  "pt-BR": {
    archiveLabel: "MÉTODOS / ARQUIVO",
    archiveTitle: "Métodos para agentes que precisam trabalhar melhor.",
    archiveSummary:
      "Uma biblioteca versionada de métodos de trabalho para design, frontend, motion, delivery e prática com agentes — organizada para comparação antes da instalação.",
    methodsMetric: "MÉTODOS",
    packsMetric: "PACOTES",
    categoriesMetric: "DOMÍNIOS",
    versionMetric: "VERSÃO",
    filterLabel: "Filtrar o arquivo",
  },
} as const satisfies Readonly<Record<Locale, EditorialMethodsCopy>>;
