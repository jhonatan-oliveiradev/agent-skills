import type { Locale } from "./locales";

interface EditorialEvidenceCopy {
  readonly archiveLabel: string;
  readonly archiveTitle: string;
  readonly archiveSummary: string;
  readonly reportsMetric: string;
  readonly sourcesMetric: string;
  readonly methodsMetric: string;
  readonly classificationGuideTitle: string;
  readonly realUseSummary: string;
  readonly internalSummary: string;
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
  readonly problem: string;
  readonly methods: string;
  readonly verification: string;
  readonly result: string;
  readonly decisionRecord: string;
  readonly scopeNote: string;
  readonly evidenceState: string;
  readonly sourceType: string;
  readonly openEvidence: string;
}

export const editorialEvidenceCopy = {
  en: {
    archiveLabel: "EVIDENCE / REAL WORK",
    archiveTitle: "Inspect the work behind the claims.",
    archiveSummary:
      "Each report documents a project problem, the methods applied, what was verified, and the resulting change. Evidence class and source records stay visible so the claim can be inspected.",
    reportsMetric: "CASES",
    sourcesMetric: "SOURCE RECORDS",
    methodsMetric: "SKILLS USED",
    classificationGuideTitle: "How to read the evidence",
    realUseSummary:
      "Real-use evidence documents work applied to a project outside Agent Skills Studio.",
    internalSummary: "Internal evidence documents work applied to Agent Skills Studio itself.",
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
    reportIntent: "Problem, methods, verification, result.",
    problem: "Problem",
    methods: "Methods applied",
    verification: "Verification",
    result: "Result",
    decisionRecord: "Decision record",
    scopeNote:
      "Treat this report as evidence for the methods and verification shown here. Related-pack overlap alone is not proof that a pack was used or fully validated.",
    evidenceState: "EVIDENCE STATE",
    sourceType: "SOURCE RECORD",
    openEvidence: "Inspect source record",
  },
  "pt-BR": {
    archiveLabel: "EVIDÊNCIA / TRABALHO REAL",
    archiveTitle: "Inspecione o trabalho por trás das afirmações.",
    archiveSummary:
      "Cada relatório documenta um problema de projeto, os métodos aplicados, o que foi verificado e a mudança resultante. A classe da evidência e os registros-fonte permanecem visíveis para que a afirmação possa ser inspecionada.",
    reportsMetric: "CASES",
    sourcesMetric: "REGISTROS-FONTE",
    methodsMetric: "SKILLS USADAS",
    classificationGuideTitle: "Como ler as evidências",
    realUseSummary:
      "Evidência de uso real documenta trabalho aplicado a um projeto fora do Agent Skills Studio.",
    internalSummary:
      "Evidência interna documenta trabalho aplicado ao próprio Agent Skills Studio.",
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
    reportIntent: "Problema, métodos, verificação e resultado.",
    problem: "Problema",
    methods: "Métodos aplicados",
    verification: "Verificação",
    result: "Resultado",
    decisionRecord: "Registro de decisões",
    scopeNote:
      "Trate este relatório como evidência dos métodos e da verificação mostrados aqui. A sobreposição com um pack, sozinha, não prova que o pack foi usado ou validado por completo.",
    evidenceState: "ESTADO DA EVIDÊNCIA",
    sourceType: "REGISTRO-FONTE",
    openEvidence: "Inspecionar registro-fonte",
  },
} as const satisfies Readonly<Record<Locale, EditorialEvidenceCopy>>;
