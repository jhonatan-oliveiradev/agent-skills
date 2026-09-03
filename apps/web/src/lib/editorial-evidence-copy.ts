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
    archiveTitle: "Inspect the work behind the claims.",
    archiveSummary:
      "Each case connects a real project problem to the skills used, the decisions made, the verified result, and an inspectable source record.",
    reportsMetric: "CASES",
    sourcesMetric: "SOURCE RECORDS",
    methodsMetric: "SKILLS USED",
    leading: "LEADING CASE",
    report: "EVIDENCE CASE",
    methodsApplied: "SKILLS USED",
    evidenceClass: "EVIDENCE CLASS",
    internalEvidence: "Internal evidence",
    realUseEvidence: "Real-use evidence",
    sourceAvailable: "SOURCE / AVAILABLE",
    inspect: "Inspect case evidence",
    evidenceRecord: "Inspect source record",
    readerLabel: "In this case",
    reportIntent: "Problem, methods, decisions, verification, source.",
    evidenceState: "EVIDENCE STATE",
    sourceType: "SOURCE RECORD",
    openEvidence: "Inspect source record",
  },
  "pt-BR": {
    archiveLabel: "EVIDÊNCIA / TRABALHO REAL",
    archiveTitle: "Inspecione o trabalho por trás das afirmações.",
    archiveSummary:
      "Cada case conecta um problema real de projeto às skills usadas, às decisões tomadas, ao resultado verificado e a um registro-fonte inspecionável.",
    reportsMetric: "CASES",
    sourcesMetric: "REGISTROS-FONTE",
    methodsMetric: "SKILLS USADAS",
    leading: "CASE PRINCIPAL",
    report: "CASE DE EVIDÊNCIA",
    methodsApplied: "SKILLS USADAS",
    evidenceClass: "CLASSE DA EVIDÊNCIA",
    internalEvidence: "Evidência interna",
    realUseEvidence: "Evidência de uso real",
    sourceAvailable: "FONTE / DISPONÍVEL",
    inspect: "Inspecionar evidências do case",
    evidenceRecord: "Inspecionar registro-fonte",
    readerLabel: "Neste case",
    reportIntent: "Problema, métodos, decisões, verificação e fonte.",
    evidenceState: "ESTADO DA EVIDÊNCIA",
    sourceType: "REGISTRO-FONTE",
    openEvidence: "Inspecionar registro-fonte",
  },
} as const satisfies Readonly<Record<Locale, EditorialEvidenceCopy>>;
