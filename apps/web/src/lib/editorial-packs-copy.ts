import type { Locale } from "./locales";

interface EditorialPacksCopy {
  readonly archiveLabel: string;
  readonly archiveTitle: string;
  readonly archiveSummary: string;
  readonly systemsMetric: string;
  readonly activeMetric: string;
  readonly plannedMetric: string;
  readonly versionMetric: string;
  readonly systemLabel: string;
  readonly intentLabel: string;
  readonly statusMetric: string;
  readonly active: string;
  readonly planned: string;
  readonly methods: string;
  readonly composition: string;
  readonly compositionPending: string;
  readonly explore: string;
}

export const editorialPacksCopy = {
  en: {
    archiveLabel: "PACKS / RELATED METHODS",
    archiveTitle: "Use a pack when one method is not enough.",
    archiveSummary:
      "Each pack groups related skills around a broader discipline or workflow. Install them together; invoke each method independently when its trigger fits the work.",
    systemsMetric: "PACKS",
    activeMetric: "ACTIVE",
    plannedMetric: "PLANNED",
    versionMetric: "VERSION",
    systemLabel: "PACK",
    intentLabel: "PACK SCOPE",
    statusMetric: "STATUS",
    active: "ACTIVE PACK",
    planned: "PLANNED PACK",
    methods: "SKILLS",
    composition: "MEMBERS",
    compositionPending: "Members in development",
    explore: "Inspect pack",
  },
  "pt-BR": {
    archiveLabel: "PACKS / MÉTODOS RELACIONADOS",
    archiveTitle: "Use um pack quando um único método não for suficiente.",
    archiveSummary:
      "Cada pack agrupa skills relacionadas em torno de uma disciplina ou fluxo mais amplo. Instale-as em conjunto; invoque cada método de forma independente quando o gatilho corresponder ao trabalho.",
    systemsMetric: "PACKS",
    activeMetric: "ATIVOS",
    plannedMetric: "PLANEJADOS",
    versionMetric: "VERSÃO",
    systemLabel: "PACK",
    intentLabel: "ESCOPO DO PACK",
    statusMetric: "STATUS",
    active: "PACK ATIVO",
    planned: "PACK PLANEJADO",
    methods: "SKILLS",
    composition: "MEMBROS",
    compositionPending: "Membros em desenvolvimento",
    explore: "Inspecionar pack",
  },
} as const satisfies Readonly<Record<Locale, EditorialPacksCopy>>;
