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
  readonly evidenceClass: string;
  readonly internalEvidence: string;
  readonly realUseEvidence: string;
  readonly sourceAvailable: string;
  readonly inspect: string;
  readonly evidenceRecord: string;
  readonly readerLabel: string;
  readonly reportIntent: string;
  readonly evidenceState: string;
  readonly sourceType: string;
  readonly openEvidence: string;
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
    evidenceClass: "EVIDENCE CLASS",
    internalEvidence: "Internal evidence",
    realUseEvidence: "Real-use evidence",
    sourceAvailable: "SOURCE / AVAILABLE",
    inspect: "Inspect report",
    evidenceRecord: "Evidence record",
    readerLabel: "In this report",
    reportIntent: "From problem to inspectable record.",
    evidenceState: "EVIDENCE STATE",
    sourceType: "SOURCE RECORD",
    openEvidence: "Open evidence",
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
    evidenceClass: "CLASSE DA EVIDÊNCIA",
    internalEvidence: "Evidência interna",
    realUseEvidence: "Evidência de uso real",
    sourceAvailable: "FONTE / DISPONÍVEL",
    inspect: "Inspecionar relatório",
    evidenceRecord: "Registro de evidência",
    readerLabel: "Neste relatório",
    reportIntent: "Do problema ao registro inspecionável.",
    evidenceState: "ESTADO DA EVIDÊNCIA",
    sourceType: "REGISTRO-FONTE",
    openEvidence: "Abrir evidência",
  },
} as const satisfies Readonly<Record<Locale, EditorialEvidenceCopy>>;
