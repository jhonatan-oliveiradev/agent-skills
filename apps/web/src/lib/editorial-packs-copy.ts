import type { Locale } from "./locales";

interface EditorialPacksCopy {
  readonly archiveLabel: string;
  readonly archiveTitle: string;
  readonly archiveSummary: string;
  readonly selectionTitle: string;
  readonly selectionSummary: string;
  readonly usageTitle: string;
  readonly usageSummary: string;
  readonly notFoundAction: string;
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
    selectionTitle: "Skill or pack?",
    selectionSummary:
      "Choose a skill for one bounded method. Choose a pack when the work spans several related methods that belong together but remain independently invokable.",
    usageTitle: "How to use this pack",
    usageSummary:
      "A pack is not a fixed workflow. Install the related methods together, then invoke only the skill whose trigger matches the current task; responsibility stays with each member skill.",
    notFoundAction: "Explore all packs",
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
    selectionTitle: "Skill ou pack?",
    selectionSummary:
      "Escolha uma skill para um método bem delimitado. Escolha um pack quando o trabalho exigir vários métodos relacionados que pertencem ao mesmo sistema, mas continuam invocáveis de forma independente.",
    usageTitle: "Como usar este pack",
    usageSummary:
      "Um pack não é um fluxo fixo. Instale os métodos relacionados em conjunto e invoque somente a skill cujo gatilho corresponde à tarefa atual; a responsabilidade continua com cada skill membro.",
    notFoundAction: "Explorar todos os packs",
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
