import type { Locale } from "@/lib/locales";
import type { ConfidenceLevel, ProficiencyLevel, TargetRoleId } from "./types";

export const careerLabRoleLabels: Readonly<Record<Locale, Readonly<Record<TargetRoleId, string>>>> = {
  en: {
    "frontend-developer": "Frontend Developer",
    "backend-developer": "Backend Developer",
    "fullstack-developer": "Full-stack Developer",
  },
  "pt-BR": {
    "frontend-developer": "Desenvolvedor Frontend",
    "backend-developer": "Desenvolvedor Backend",
    "fullstack-developer": "Desenvolvedor Full-stack",
  },
};

function englishCompetencyState(level: ProficiencyLevel | null, confidence: ConfidenceLevel): string {
  return `${level ?? "unknown"} · ${confidence} confidence`;
}

function portugueseCompetencyState(level: ProficiencyLevel | null, confidence: ConfidenceLevel): string {
  const levels: Record<ProficiencyLevel, string> = {
    foundation: "fundamentos",
    developing: "em desenvolvimento",
    proficient: "proficiente",
    advanced: "avançado",
  };
  const confidences: Record<ConfidenceLevel, string> = {
    low: "baixa confiança",
    medium: "confiança média",
    high: "alta confiança",
  };
  return `${level ? levels[level] : "desconhecido"} · ${confidences[confidence]}`;
}

function englishAssessmentLevel(level: ProficiencyLevel): string {
  return {
    foundation: "Foundation",
    developing: "Developing",
    proficient: "Proficient",
    advanced: "Advanced",
  }[level];
}

function portugueseAssessmentLevel(level: ProficiencyLevel): string {
  return {
    foundation: "Fundamentos",
    developing: "Em desenvolvimento",
    proficient: "Proficiente",
    advanced: "Avançado",
  }[level];
}

function englishAssessmentConfidence(confidence: ConfidenceLevel): string {
  return `${confidence} confidence`;
}

function portugueseAssessmentConfidence(confidence: ConfidenceLevel): string {
  return {
    low: "baixa confiança",
    medium: "confiança média",
    high: "alta confiança",
  }[confidence];
}

function portugueseAssessmentSignal(signal: string): string {
  const passed = /^Passed (.+) observation$/.exec(signal);
  if (passed) {
    const kinds: Record<string, string> = {
      "single-choice": "escolha única",
      "multi-select": "múltipla seleção",
      "code-reading-choice": "leitura de código",
      "debugging-choice": "depuração",
      "structured-ordering": "ordenação estruturada",
    };
    return `Observação de ${kinds[passed[1]] ?? passed[1]} aprovada.`;
  }
  const reassess = /^Reassess (.+) with a deterministic challenge$/.exec(signal);
  if (reassess) {
    const dimensions: Record<string, string> = {
      reasoning: "raciocínio",
      performance: "desempenho",
      authentic: "evidência autêntica",
    };
    return `Reavalie ${dimensions[reassess[1]] ?? reassess[1]} com um desafio determinístico.`;
  }
  if (signal === "Add another deterministic performance observation.") {
    return "Adicione outra observação determinística de desempenho.";
  }
  return signal;
}

export const careerLabCopy = {
  en: {
    navigation: ["Overview", "Roadmap", "Assessments", "Evidence", "Market"],
    eyebrow: "Career Lab / local workspace",
    title: "Build career progress from evidence, not activity.",
    summary: "Your Career Profile, readiness signals and future roadmap stay local to this browser until you explicitly export them.",
    developerCareerPack: "Developer Career Pack",
    developerCareerPackHint: "Inspect the canonical methods behind this workspace.",
    loading: "Loading local Career Profile…",
    storageError: "Career Lab could not read local profile data.",
    startOnboarding: "Start onboarding",
    noProfileTitle: "Create your local Career Profile",
    noProfileBody: "Choose a target role, market and weekly capacity. Career Lab will begin with unknown capability states rather than assuming weakness.",
    readiness: "Role readiness",
    targetMarket: (market: string) => `Target market: ${market}`,
    currentFocus: "Current focus",
    noCurrentFocus: "No current focus yet",
    roadmapProgress: "Roadmap progress",
    milestoneProgress: (completed: number, total: number) => `${completed} / ${total} milestones`,
    competencyStates: "Competency states",
    competencyState: englishCompetencyState,
    blockingGaps: "Blocking gaps",
    openGaps: (count: number) => `${count} open`,
    evidence: "Evidence records",
    assessments: "assessments",
    baselineIncomplete: "Baseline assessment still incomplete.",
    latestMarket: "Latest market sample",
    noMarketSample: "No market sample yet",
    postings: "postings",
    companies: "companies",
    sources: "sources",
    weeklyCapacity: (hours: number) => `${hours}h / week`,
    capabilityGap: "capability",
    evidenceGap: "evidence",
    localData: "Local data",
    exportProfile: "Export profile",
    importProfile: "Import profile",
    importSuccess: "Profile imported",
    importFailed: "Import failed. The existing local profile was not changed.",
    resetProfile: "Reset profile",
    confirmReset: "Confirm reset",
    cancel: "Cancel",
    resetWarning: "This removes the Career Profile stored in this browser.",
    resetComplete: "Local Career Profile reset",
    assessment: {
      eyebrow: "Skill assessment",
      listTitle: "Baseline assessments",
      listBody: "Short, deterministic probes establish an evidence-aware baseline.",
      itemSuffix: "baseline assessment",
      progress: (current: number, total: number) => `Challenge ${current} of ${total}`,
      arrange: "Arrange the steps in order",
      chooseResponse: "Choose a response before completing the assessment.",
      previous: "Previous challenge",
      next: "Next challenge",
      complete: "Complete assessment",
      notFound: "Assessment not found.",
      resultEyebrow: "Proficiency report",
      levelLabel: englishAssessmentLevel,
      confidenceLabel: englishAssessmentConfidence,
      strongSignals: "Strong signals",
      weakSignals: "Weak signals",
      noStrongSignals: "No strong signals recorded yet.",
      noWeakSignals: "No weak signals recorded.",
      nextEvidence: "Next evidence",
      signal: (signal: string) => signal,
    },
    onboarding: {
      title: "Set up your Career Profile",
      contextTitle: "Current context",
      contextLabel: "Current context",
      contextHint: "Describe what you build, what you work with and what you want Career Lab to take into account.",
      roleTitle: "Target role",
      marketTitle: "Market and capacity",
      reviewTitle: "Baseline diagnostic",
      marketLabel: "Target market",
      weeklyHoursLabel: "Weekly study hours",
      undecided: "Undecided",
      undecidedHint: "You can explore here, but V1 needs one target role before the profile can be created.",
      markets: { br: "Brazil", global: "Global / remote", us: "United States", eu: "European Union" },
      continue: "Continue",
      back: "Back",
      create: "Create Career Profile",
      reviewBody: "Career Lab will create an evidence-neutral baseline: every required capability starts unknown with low confidence until real evidence is added.",
      startBaselineAssessment: "Start baseline assessment",
    },
  },
  "pt-BR": {
    navigation: ["Visão geral", "Roadmap", "Avaliações", "Evidências", "Mercado"],
    eyebrow: "Career Lab / workspace local",
    title: "Construa progresso de carreira a partir de evidências, não de atividade.",
    summary: "Seu Career Profile, sinais de readiness e futuro roadmap ficam locais neste navegador até que você os exporte explicitamente.",
    developerCareerPack: "Pack Developer Career",
    developerCareerPackHint: "Inspecione os métodos canônicos por trás deste workspace.",
    loading: "Carregando Career Profile local…",
    storageError: "O Career Lab não conseguiu ler os dados locais do perfil.",
    startOnboarding: "Iniciar onboarding",
    noProfileTitle: "Crie seu Career Profile local",
    noProfileBody: "Escolha função-alvo, mercado e capacidade semanal. O Career Lab começa com capacidades desconhecidas em vez de assumir fraqueza.",
    readiness: "Readiness para a função",
    targetMarket: (market: string) => `Mercado-alvo: ${market}`,
    currentFocus: "Foco atual",
    noCurrentFocus: "Nenhum foco atual ainda",
    roadmapProgress: "Progresso do roadmap",
    milestoneProgress: (completed: number, total: number) => `${completed} / ${total} marcos`,
    competencyStates: "Estados de competência",
    competencyState: portugueseCompetencyState,
    blockingGaps: "Gaps bloqueadores",
    openGaps: (count: number) => `${count} em aberto`,
    evidence: "Registros de evidência",
    assessments: "avaliações",
    baselineIncomplete: "A avaliação de baseline ainda está incompleta.",
    latestMarket: "Amostra de mercado mais recente",
    noMarketSample: "Nenhuma amostra de mercado ainda",
    postings: "vagas",
    companies: "empresas",
    sources: "fontes",
    weeklyCapacity: (hours: number) => `${hours}h / semana`,
    capabilityGap: "capacidade",
    evidenceGap: "evidência",
    localData: "Dados locais",
    exportProfile: "Exportar perfil",
    importProfile: "Importar perfil",
    importSuccess: "Perfil importado",
    importFailed: "Falha na importação. O perfil local existente não foi alterado.",
    resetProfile: "Resetar perfil",
    confirmReset: "Confirmar reset",
    cancel: "Cancelar",
    resetWarning: "Isso remove o Career Profile armazenado neste navegador.",
    resetComplete: "Career Profile local resetado",
    assessment: {
      eyebrow: "Avaliação de competências",
      listTitle: "Avaliações de baseline",
      listBody: "Sondagens curtas e determinísticas estabelecem um baseline orientado por evidências.",
      itemSuffix: "avaliação de baseline",
      progress: (current: number, total: number) => `Desafio ${current} de ${total}`,
      arrange: "Organize as etapas na ordem correta",
      chooseResponse: "Escolha uma resposta antes de concluir a avaliação.",
      previous: "Desafio anterior",
      next: "Próximo desafio",
      complete: "Concluir avaliação",
      notFound: "Avaliação não encontrada.",
      resultEyebrow: "Relatório de proficiência",
      levelLabel: portugueseAssessmentLevel,
      confidenceLabel: portugueseAssessmentConfidence,
      strongSignals: "Sinais fortes",
      weakSignals: "Sinais fracos",
      noStrongSignals: "Nenhum sinal forte registrado ainda.",
      noWeakSignals: "Nenhum sinal fraco registrado.",
      nextEvidence: "Próxima evidência",
      signal: portugueseAssessmentSignal,
    },
    onboarding: {
      title: "Configure seu Career Profile",
      contextTitle: "Contexto atual",
      contextLabel: "Contexto atual",
      contextHint: "Descreva o que você constrói, com o que trabalha e o que o Career Lab deve considerar.",
      roleTitle: "Função-alvo",
      marketTitle: "Mercado e capacidade",
      reviewTitle: "Diagnóstico de baseline",
      marketLabel: "Mercado-alvo",
      weeklyHoursLabel: "Horas de estudo por semana",
      undecided: "Ainda não decidi",
      undecidedHint: "Você pode explorar, mas a V1 precisa de uma função-alvo antes de criar o perfil.",
      markets: { br: "Brasil", global: "Global / remoto", us: "Estados Unidos", eu: "União Europeia" },
      continue: "Continuar",
      back: "Voltar",
      create: "Criar Career Profile",
      reviewBody: "O Career Lab criará um baseline neutro em evidências: cada capacidade necessária começa desconhecida e com baixa confiança até surgirem evidências reais.",
      startBaselineAssessment: "Iniciar avaliação de baseline",
    },
  },
} as const;
