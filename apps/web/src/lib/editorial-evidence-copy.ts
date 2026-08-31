import type { Locale } from "./locales";

interface EditorialEvidenceCopy {
  readonly archiveLabel: string;
  readonly archiveTitle: string;
  readonly archiveSummary: string;
  readonly reportsMetric: string;
  readonly sourcesMetric: string;
  readonly methodsMetric: string;
  readonly leading: string;
  readonly report: string;
  readonly methodsApplied: string;
  readonly sourceAvailable: string;
  readonly inspect: string;
  readonly evidenceRecord: string;
}

export const editorialEvidenceCopy = {
  en: {
    archiveLabel: "EVIDENCE / REAL WORK",
    archiveTitle: "Don't trust the description. Inspect the result.",
    archiveSummary:
      "Real product decisions, applied methods, and inspectable source records from work built with Agent Skills Studio.",
    reportsMetric: "REPORTS",
    sourcesMetric: "SOURCE RECORDS",
    methodsMetric: "METHODS",
    leading: "LEADING REPORT",
    report: "EVIDENCE REPORT",
    methodsApplied: "METHODS APPLIED",
    sourceAvailable: "SOURCE / AVAILABLE",
    inspect: "Inspect report",
    evidenceRecord: "Evidence record",
  },
  "pt-BR": {
    archiveLabel: "EVIDÊNCIA / TRABALHO REAL",
    archiveTitle: "Não confie na descrição. Inspecione o resultado.",
    archiveSummary:
      "Decisões reais de produto, métodos aplicados e registros-fonte inspecionáveis de trabalhos construídos com o Agent Skills Studio.",
    reportsMetric: "RELATÓRIOS",
    sourcesMetric: "REGISTROS-FONTE",
    methodsMetric: "MÉTODOS",
    leading: "RELATÓRIO PRINCIPAL",
    report: "RELATÓRIO DE EVIDÊNCIA",
    methodsApplied: "MÉTODOS APLICADOS",
    sourceAvailable: "FONTE / DISPONÍVEL",
    inspect: "Inspecionar relatório",
    evidenceRecord: "Registro de evidência",
  },
} as const satisfies Readonly<Record<Locale, EditorialEvidenceCopy>>;
