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
    archiveLabel: "SKILLS / METHOD LIBRARY",
    archiveTitle: "Find a method for the work in front of you.",
    archiveSummary:
      "Search the versioned collection by task, domain, pack, difficulty, or maturity. Open a skill to inspect its trigger, boundaries, process, and installation path before you use it.",
    methodsMetric: "SKILLS",
    packsMetric: "PACKS",
    categoriesMetric: "DOMAINS",
    versionMetric: "VERSION",
    filterLabel: "Filter skills",
    categoryLabels: {
      "backend-data": "Backend & data",
      "architecture-engineering": "Architecture & engineering",
      "quality-testing": "Quality & testing",
      "application-security": "Application security",
      "engineering-workflow": "Engineering workflow",
      "brand-design": "Brand design",
      "writing-communication": "Writing & communication",
    },
    methodLabel: "SKILL",
    onThisMethod: "In this skill",
    promptLabel: "EXAMPLE REQUEST",
    technicalNotes: "TECHNICAL NOTES",
  },
  "pt-BR": {
    archiveLabel: "SKILLS / BIBLIOTECA DE MÉTODOS",
    archiveTitle: "Encontre um método para o trabalho que você precisa resolver.",
    archiveSummary:
      "Pesquise a coleção versionada por tarefa, domínio, pack, dificuldade ou maturidade. Abra uma skill para inspecionar seu gatilho, limites, processo e caminho de instalação antes de usá-la.",
    methodsMetric: "SKILLS",
    packsMetric: "PACKS",
    categoriesMetric: "DOMÍNIOS",
    versionMetric: "VERSÃO",
    filterLabel: "Filtrar skills",
    categoryLabels: {
      "backend-data": "Backend e dados",
      "architecture-engineering": "Arquitetura e engenharia",
      "quality-testing": "Qualidade e testes",
      "application-security": "Segurança de aplicações",
      "engineering-workflow": "Fluxo de engenharia",
      "brand-design": "Design de marca",
      "writing-communication": "Escrita & comunicação",
    },
    methodLabel: "SKILL",
    onThisMethod: "Nesta skill",
    promptLabel: "PEDIDO DE EXEMPLO",
    technicalNotes: "NOTAS TÉCNICAS",
  },
} as const satisfies Readonly<Record<Locale, EditorialMethodsCopy>>;
