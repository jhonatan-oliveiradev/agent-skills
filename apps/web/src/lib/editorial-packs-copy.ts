import type { Locale } from "./locales";

interface EditorialPacksCopy {
  readonly archiveLabel: string;
  readonly archiveTitle: string;
  readonly archiveSummary: string;
  readonly systemsMetric: string;
  readonly activeMetric: string;
  readonly plannedMetric: string;
  readonly versionMetric: string;
  readonly active: string;
  readonly planned: string;
  readonly methods: string;
  readonly composition: string;
  readonly compositionPending: string;
  readonly explore: string;
}

export const editorialPacksCopy = {
  en: {
    archiveLabel: "SYSTEMS / CURATED COLLECTION",
    archiveTitle: "Methods that become stronger together.",
    archiveSummary:
      "Curated systems combine compatible working methods into deliberate paths for design, engineering, motion, delivery, and agent practice.",
    systemsMetric: "SYSTEMS",
    activeMetric: "ACTIVE",
    plannedMetric: "PLANNED",
    versionMetric: "VERSION",
    active: "ACTIVE SYSTEM",
    planned: "PLANNED SYSTEM",
    methods: "METHODS",
    composition: "COMPOSITION",
    compositionPending: "Composition in development",
    explore: "Explore system",
  },
  "pt-BR": {
    archiveLabel: "SISTEMAS / COLEÇÃO CURADA",
    archiveTitle: "Métodos que ficam melhores juntos.",
    archiveSummary:
      "Sistemas curados combinam métodos de trabalho compatíveis em caminhos deliberados para design, engenharia, motion, delivery e prática com agentes.",
    systemsMetric: "SISTEMAS",
    activeMetric: "ATIVOS",
    plannedMetric: "PLANEJADOS",
    versionMetric: "VERSÃO",
    active: "SISTEMA ATIVO",
    planned: "SISTEMA PLANEJADO",
    methods: "MÉTODOS",
    composition: "COMPOSIÇÃO",
    compositionPending: "Composição em desenvolvimento",
    explore: "Explorar sistema",
  },
} as const satisfies Readonly<Record<Locale, EditorialPacksCopy>>;
