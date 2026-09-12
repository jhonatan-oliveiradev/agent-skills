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
    navigation: ["Overview", "Assessments", "Learning", "Roadmap", "Evidence", "Market"],
    eyebrow: "Career Lab / local workspace",
    title: "Build career progress from evidence, not activity.",
    summary: "Your Career Profile, readiness signals and future roadmap stay local to this browser until you explicitly export them.",
    guide: "Guide",
    localFirstIndicator: "Local-first",
    utilities: "Profile utilities",
    developerCareerPack: "Developer Career Pack",
    developerCareerPackHint: "Inspect the canonical methods behind this workspace.",
    loading: "Loading local Career Profile…",
    storageError: "Career Lab could not read local profile data.",
    startOnboarding: "Start onboarding",
    noProfileTitle: "Create your local Career Profile",
    noProfileBody: "Choose a target role, market and weekly capacity. Career Lab will begin with unknown capability states rather than assuming weakness.",
    entry: {
      eyebrow: "01 / Start here",
      title: "Build a real map of your career.",
      body: "Define the target, calibrate your current level, and turn real evidence into development priorities.",
      cta: "Start Career Profile",
      localNote: "Your profile stays in this browser until you explicitly export it.",
      dimensions: [
        { label: "01 / Role", body: "Choose where you want to go." },
        { label: "02 / Market", body: "Define where you want to compete." },
        { label: "03 / Capacity", body: "Set a sustainable weekly pace." },
      ],
      journeyEyebrow: "05 / Evidence-led progression",
      howItWorks: "How Career Lab works",
      stages: [
        { title: "Profile", body: "Define context and objective." },
        { title: "Assessment", body: "Calibrate your current level." },
        { title: "Roadmap", body: "Turn gaps into priorities." },
        { title: "Evidence", body: "Prove what changed." },
        { title: "Market", body: "Compare with real opportunities." },
      ],
    },
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
    noEvidenceYet: "No evidence yet",
    assessments: "assessments",
    noAssessmentsYet: "No assessments yet",
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
      indexEyebrow: "Baseline / evidence calibration",
      indexBody: "Complete the required baselines to replace unknown capability states with evidence-backed levels.",
      completedSummary: (done: number, total: number) => `${done} of ${total} completed`,
      notStarted: "Not started",
      completed: "Completed",
      start: (title: string) => `Start ${title}`,
      review: (title: string) => `Review ${title}`,
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
    navigation: ["Visão geral", "Avaliações", "Aprendizado", "Roadmap", "Evidências", "Mercado"],
    eyebrow: "Career Lab / workspace local",
    title: "Construa progresso de carreira a partir de evidências, não de atividade.",
    summary: "Seu Career Profile, sinais de readiness e futuro roadmap ficam locais neste navegador até que você os exporte explicitamente.",
    guide: "Guia",
    localFirstIndicator: "Local-first",
    utilities: "Utilitários do perfil",
    developerCareerPack: "Pack Developer Career",
    developerCareerPackHint: "Inspecione os métodos canônicos por trás deste workspace.",
    loading: "Carregando Career Profile local…",
    storageError: "O Career Lab não conseguiu ler os dados locais do perfil.",
    startOnboarding: "Iniciar onboarding",
    noProfileTitle: "Crie seu Career Profile local",
    noProfileBody: "Escolha função-alvo, mercado e capacidade semanal. O Career Lab começa com capacidades desconhecidas em vez de assumir fraqueza.",
    entry: {
      eyebrow: "01 / Comece aqui",
      title: "Construa um mapa real da sua carreira.",
      body: "Defina o alvo, calibre seu nível atual e transforme evidências reais em prioridades de desenvolvimento.",
      cta: "Iniciar Career Profile",
      localNote: "Seu perfil fica neste navegador até que você o exporte explicitamente.",
      dimensions: [
        { label: "01 / Função", body: "Escolha onde quer chegar." },
        { label: "02 / Mercado", body: "Defina onde quer competir." },
        { label: "03 / Capacidade", body: "Determine um ritmo semanal sustentável." },
      ],
      journeyEyebrow: "05 / Progressão por evidências",
      howItWorks: "Como o Career Lab funciona",
      stages: [
        { title: "Perfil", body: "Defina contexto e objetivo." },
        { title: "Avaliação", body: "Calibre seu nível atual." },
        { title: "Roadmap", body: "Transforme gaps em prioridades." },
        { title: "Evidências", body: "Comprove o que mudou." },
        { title: "Mercado", body: "Compare com oportunidades reais." },
      ],
    },
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
    noEvidenceYet: "Nenhuma evidência ainda",
    assessments: "avaliações",
    noAssessmentsYet: "Nenhuma avaliação ainda",
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
      indexEyebrow: "Baseline / calibração por evidências",
      indexBody: "Conclua os baselines obrigatórios para substituir estados de capacidade desconhecidos por níveis sustentados por evidências.",
      completedSummary: (done: number, total: number) => `${done} de ${total} concluídas`,
      notStarted: "Não iniciada",
      completed: "Concluída",
      start: (title: string) => `Iniciar ${title}`,
      review: (title: string) => `Revisar ${title}`,
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