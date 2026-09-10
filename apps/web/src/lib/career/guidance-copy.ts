import type { Locale } from "@/lib/locales";

export type CareerGuideAreaId =
  | "overview"
  | "roadmap"
  | "assessments"
  | "evidence"
  | "market";

export interface CareerGuideAreaCopy {
  readonly id: CareerGuideAreaId;
  readonly title: string;
  readonly purpose: string;
  readonly when: string;
  readonly done: string;
  readonly after: string;
}

export interface CareerGuideQuestionCopy {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface CareerGuideCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly startHereTitle: string;
  readonly labels: Readonly<{
    purpose: string;
    when: string;
    done: string;
    after: string;
  }>;
  readonly stages: readonly CareerGuideAreaCopy[];
  readonly qaTitle: string;
  readonly questions: readonly CareerGuideQuestionCopy[];
  readonly restartTitle: string;
  readonly restartBody: string;
  readonly restartAction: string;
}

export interface CareerOrientationCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly stages: readonly Readonly<{
    id: CareerGuideAreaId;
    title: string;
    body: string;
  }>[];
  readonly skip: string;
  readonly complete: string;
  readonly close: string;
}

type CareerNextActionPresentation = Readonly<{
  title: string;
  reason: string;
  action: string;
}>;

export interface CareerNextActionCopy {
  readonly label: string;
  readonly completeBaseline: (title: string) => CareerNextActionPresentation;
  readonly reviewRoadmap: CareerNextActionPresentation;
  readonly produceEvidence: (title: string, gapCount: number) => CareerNextActionPresentation;
  readonly addMarketSample: CareerNextActionPresentation;
  readonly continueRoadmap: (title: string) => CareerNextActionPresentation;
}

const enGuide: CareerGuideCopy = {
  eyebrow: "Career Lab / guide",
  title: "Use Career Lab as a working loop.",
  intro:
    "Career Lab is not a checklist to finish once. Assess your current state, work the highest-priority gap, attach evidence, compare against the market, then return to Overview to read what changed.",
  startHereTitle: "Start here",
  labels: {
    purpose: "Purpose",
    when: "Use it when",
    done: "Done means",
    after: "What changes next",
  },
  stages: [
    {
      id: "overview",
      title: "Overview",
      purpose: "Read your current state and identify the next recommended action.",
      when: "Return after a new assessment, evidence record, market sample, or roadmap change.",
      done: "You can explain what changed and which working surface needs attention now.",
      after: "Move to the recommended surface instead of treating Overview as the work itself.",
    },
    {
      id: "roadmap",
      title: "Roadmap",
      purpose: "Turn capability and evidence gaps into an ordered development path.",
      when: "Use it after establishing your baseline and whenever new evidence or market input changes priorities.",
      done: "The current milestone satisfies its capability and evidence requirements.",
      after: "Career Lab can advance to the next eligible milestone.",
    },
    {
      id: "assessments",
      title: "Assessments",
      purpose: "Replace unknown capability states with deterministic, evidence-backed observations.",
      when: "Begin here after profile setup and reassess when a milestone needs fresh calibration.",
      done: "The required baseline probes have recorded a result for the capabilities they cover.",
      after: "Competency level and confidence can update readiness and roadmap priorities.",
    },
    {
      id: "evidence",
      title: "Evidence",
      purpose: "Connect a capability claim to an inspectable artifact and its provenance.",
      when: "Use it when the current roadmap focus produces work that demonstrates the targeted capability.",
      done: "The record points to concrete work, explains what it demonstrates, and can be inspected or verified.",
      after: "Evidence can satisfy roadmap requirements and strengthen evidence-backed competency state.",
    },
    {
      id: "market",
      title: "Market",
      purpose: "Compare your development plan with explicit signals from real job descriptions.",
      when: "Use it after choosing a target role and market, then refresh it when your comparison set becomes stale.",
      done: "You have a small representative sample with useful explicit demand signals.",
      after: "Market relevance can inform roadmap interpretation without automatically increasing readiness.",
    },
  ],
  qaTitle: "Questions and answers",
  questions: [
    { id: "where-start", question: "Where do I start?", answer: "Create your Career Profile, complete the required baseline assessments, then follow the current Roadmap focus. Overview is where you return to read the result of new work." },
    { id: "readiness-zero", question: "Why is my readiness 0%?", answer: "A new profile starts with unknown capability states and low confidence. Zero readiness means Career Lab does not yet have enough evidence-backed capability data for the target role; it is not a judgment of your professional value." },
    { id: "baseline", question: "What is a baseline assessment?", answer: "A baseline is a short deterministic probe that records an evidence-backed observation for a competency. It gives Career Lab a calibrated starting point instead of assuming strength or weakness." },
    { id: "all-assessments", question: "Do I need to complete every assessment before using the roadmap?", answer: "The roadmap can exist before every baseline is complete, but unresolved baselines leave important competency states unknown. Complete the required baselines before treating readiness and roadmap priorities as fully calibrated." },
    { id: "professional-evidence", question: "What counts as professional evidence?", answer: "Use inspectable work such as a repository change, pull request, test report, architecture decision, screenshot, log, or other concrete artifact tied to observable behavior. A claim without an inspectable artifact is not strong evidence." },
    { id: "real-job-description", question: "Why does Career Lab ask for a real job description?", answer: "A real posting provides explicit capability and structural-demand signals from the market you want to enter. Career Lab treats the posting as an input to inspect, not as trusted truth about your fit." },
    { id: "multiple-jobs", question: "Do I need to register multiple jobs?", answer: "No. Start with a small representative sample. Add another posting when it contributes a genuinely different signal; useful coverage matters more than volume." },
    { id: "roadmap-changes", question: "What changes the roadmap?", answer: "Assessment results, portfolio evidence, market updates, and target changes can trigger roadmap recalculation through the existing Career Lab decision rules." },
    { id: "readiness-changes", question: "What changes readiness?", answer: "Readiness changes when evidence-backed competency state changes relative to the requirements of your target role. Market samples can influence roadmap relevance, but they do not automatically increase readiness." },
    { id: "data-storage", question: "Where is my data stored?", answer: "Your Career Profile stays in this browser unless you explicitly export it. Career Lab does not require a cloud account for this workspace." },
    { id: "data-controls", question: "What do export, import and reset do?", answer: "Export downloads a JSON copy of your Career Profile. Import validates a compatible JSON file before replacing the local profile. Reset removes the Career Profile stored in this browser." },
    { id: "restart-orientation", question: "Can I restart the product onboarding?", answer: "Yes. The Guide provides a restart control for the product orientation. Restarting orientation does not clear or recreate your Career Profile." },
  ],
  restartTitle: "Need the operating model again?",
  restartBody: "The product orientation can be reopened without changing your Career Profile, assessments, roadmap, evidence, or market samples.",
  restartAction: "Restart orientation",
};

const ptBrGuide: CareerGuideCopy = {
  eyebrow: "Career Lab / guia",
  title: "Use o Career Lab como um ciclo de trabalho.",
  intro: "O Career Lab não é uma checklist para concluir uma vez. Avalie seu estado atual, trabalhe o gap de maior prioridade, registre evidências, compare com o mercado e volte à Visão geral para entender o que mudou.",
  startHereTitle: "Comece aqui",
  labels: { purpose: "Objetivo", when: "Use quando", done: "Concluído significa", after: "O que muda depois" },
  stages: [
    { id: "overview", title: "Visão geral", purpose: "Leia seu estado atual e identifique a próxima ação recomendada.", when: "Volte depois de uma nova avaliação, evidência, amostra de mercado ou mudança no roadmap.", done: "Você consegue explicar o que mudou e qual superfície de trabalho precisa de atenção agora.", after: "Siga para a superfície recomendada em vez de tratar a Visão geral como o trabalho em si." },
    { id: "roadmap", title: "Roadmap", purpose: "Transforme gaps de capacidade e evidência em um caminho ordenado de desenvolvimento.", when: "Use após estabelecer seu baseline e sempre que novas evidências ou sinais de mercado alterarem prioridades.", done: "O marco atual atende aos requisitos de capacidade e evidência.", after: "O Career Lab pode avançar para o próximo marco elegível." },
    { id: "assessments", title: "Avaliações", purpose: "Substitua capacidades desconhecidas por observações determinísticas sustentadas por evidências.", when: "Comece aqui após configurar o perfil e reavalie quando um marco precisar de nova calibração.", done: "Os baselines obrigatórios registraram resultado para as capacidades que cobrem.", after: "Nível e confiança das competências podem atualizar readiness e prioridades do roadmap." },
    { id: "evidence", title: "Evidências", purpose: "Conecte uma afirmação de capacidade a um artefato inspecionável e sua proveniência.", when: "Use quando o foco atual do roadmap produzir trabalho que demonstre a capacidade-alvo.", done: "O registro aponta para trabalho concreto, explica o que ele demonstra e pode ser inspecionado ou verificado.", after: "A evidência pode atender requisitos do roadmap e fortalecer o estado da competência." },
    { id: "market", title: "Mercado", purpose: "Compare seu plano de desenvolvimento com sinais explícitos de vagas reais.", when: "Use após escolher função e mercado-alvo e atualize quando sua amostra deixar de representar o mercado.", done: "Você possui uma pequena amostra representativa com sinais explícitos úteis de demanda.", after: "A relevância de mercado pode informar o roadmap sem aumentar readiness automaticamente." },
  ],
  qaTitle: "Perguntas e respostas",
  questions: [
    { id: "where-start", question: "Por onde começo?", answer: "Crie seu Career Profile, conclua as avaliações de baseline obrigatórias e depois siga o foco atual do Roadmap. A Visão geral é o lugar para onde você volta para ler o resultado do novo trabalho." },
    { id: "readiness-zero", question: "Por que meu readiness está em 0%?", answer: "Um perfil novo começa com capacidades desconhecidas e baixa confiança. Readiness zero significa que o Career Lab ainda não possui dados suficientes sustentados por evidências para a função-alvo; não é um julgamento sobre seu valor profissional." },
    { id: "baseline", question: "O que é uma avaliação de baseline?", answer: "É uma sondagem determinística curta que registra uma observação sustentada por evidência para uma competência. Ela oferece um ponto de partida calibrado em vez de presumir força ou fraqueza." },
    { id: "all-assessments", question: "Preciso concluir todas as avaliações antes de usar o roadmap?", answer: "O roadmap pode existir antes de todos os baselines, mas baselines pendentes mantêm capacidades importantes desconhecidas. Conclua os baselines obrigatórios antes de tratar readiness e prioridades como plenamente calibrados." },
    { id: "professional-evidence", question: "O que conta como evidência profissional?", answer: "Use trabalho inspecionável: mudança em repositório, pull request, relatório de testes, decisão arquitetural, screenshot, log ou outro artefato concreto ligado a comportamento observável. Uma afirmação sem artefato inspecionável não é uma evidência forte." },
    { id: "real-job-description", question: "Por que o Career Lab pede uma descrição de vaga real?", answer: "Uma vaga real fornece sinais explícitos de capacidade e requisitos estruturais do mercado em que você quer competir. O Career Lab trata a vaga como uma entrada para inspeção, não como verdade sobre sua adequação." },
    { id: "multiple-jobs", question: "Preciso registrar várias vagas?", answer: "Não. Comece com uma amostra pequena e representativa. Adicione outra vaga quando ela trouxer um sinal realmente diferente; cobertura útil importa mais do que volume." },
    { id: "roadmap-changes", question: "O que altera o roadmap?", answer: "Resultados de avaliações, evidências de portfólio, atualizações de mercado e mudanças de alvo podem disparar o recálculo do roadmap pelas regras existentes do Career Lab." },
    { id: "readiness-changes", question: "O que altera o readiness?", answer: "O readiness muda quando o estado de competências sustentado por evidências muda em relação aos requisitos da função-alvo. Amostras de mercado podem influenciar a relevância do roadmap, mas não aumentam readiness automaticamente." },
    { id: "data-storage", question: "Onde meus dados ficam armazenados?", answer: "Seu Career Profile permanece neste navegador até que você o exporte explicitamente. O Career Lab não exige uma conta em nuvem para este workspace." },
    { id: "data-controls", question: "O que exportar, importar e resetar fazem?", answer: "Exportar baixa uma cópia JSON do seu Career Profile. Importar valida um JSON compatível antes de substituir o perfil local. Resetar remove o Career Profile armazenado neste navegador." },
    { id: "restart-orientation", question: "Posso reiniciar o onboarding do produto?", answer: "Sim. O Guia oferece um controle para reiniciar a orientação do produto. Reiniciar a orientação não limpa nem recria seu Career Profile." },
  ],
  restartTitle: "Precisa rever o modelo de uso?",
  restartBody: "A orientação do produto pode ser reaberta sem alterar seu Career Profile, avaliações, roadmap, evidências ou amostras de mercado.",
  restartAction: "Reiniciar orientação",
};

function buildOrientationCopy(
  guide: CareerGuideCopy,
  labels: Omit<CareerOrientationCopy, "stages">,
): CareerOrientationCopy {
  return {
    ...labels,
    stages: guide.stages.map(({ id, title, purpose }) => ({ id, title, body: purpose })),
  };
}

const enOrientation = buildOrientationCopy(enGuide, {
  eyebrow: "Career Lab / orientation",
  title: "Five surfaces. One working loop.",
  intro: "Career Lab becomes useful when each surface hands work to the next. Use this short orientation as the operating model, then return to the Guide whenever you need the detail.",
  skip: "Skip orientation",
  complete: "Complete orientation",
  close: "Close orientation",
});

const ptBrOrientation = buildOrientationCopy(ptBrGuide, {
  eyebrow: "Career Lab / orientação",
  title: "Cinco superfícies. Um ciclo de trabalho.",
  intro: "O Career Lab ganha valor quando cada superfície entrega trabalho para a próxima. Use esta orientação curta como modelo operacional e volte ao Guia quando precisar dos detalhes.",
  skip: "Pular orientação",
  complete: "Concluir orientação",
  close: "Fechar orientação",
});

const enNextAction: CareerNextActionCopy = {
  label: "Now",
  completeBaseline: (title) => ({
    title: `Complete your ${title} baseline.`,
    reason: "This assessment replaces an unknown competency state with an evidence-backed level, making the next focus more reliable.",
    action: `Start ${title}`,
  }),
  reviewRoadmap: {
    title: "Review your roadmap.",
    reason: "No current milestone needs work. Review the roadmap to understand what is complete and what should be calibrated next.",
    action: "Open Roadmap",
  },
  produceEvidence: (title, gapCount) => ({
    title: `Produce evidence for ${title}.`,
    reason: `The current milestone still has ${gapCount} evidence ${gapCount === 1 ? "gate" : "gates"} open. Register inspectable work before moving on.`,
    action: "Register evidence",
  }),
  addMarketSample: {
    title: "Add a market sample.",
    reason: "Your current focus has its evidence gate satisfied. A real job description now adds an external demand signal to the workspace.",
    action: "Add real job",
  },
  continueRoadmap: (title) => ({
    title: `Continue ${title}.`,
    reason: "Baseline, evidence and market context are available. Keep working the current roadmap focus and return here when the state changes.",
    action: "Continue in Roadmap",
  }),
};

const ptBrNextAction: CareerNextActionCopy = {
  label: "Agora",
  completeBaseline: (title) => ({
    title: `Complete seu baseline de ${title}.`,
    reason: "Esta avaliação ajuda a substituir um estado desconhecido por um nível sustentado por evidências e torna o próximo foco mais confiável.",
    action: `Iniciar ${title}`,
  }),
  reviewRoadmap: {
    title: "Revise seu roadmap.",
    reason: "Nenhum marco atual exige trabalho. Revise o roadmap para entender o que já foi concluído e o que deve ser calibrado em seguida.",
    action: "Abrir Roadmap",
  },
  produceEvidence: (title, gapCount) => ({
    title: `Produza evidência para ${title}.`,
    reason: `O marco atual ainda possui ${gapCount} ${gapCount === 1 ? "gate" : "gates"} de evidência aberto${gapCount === 1 ? "" : "s"}. Registre trabalho inspecionável antes de avançar.`,
    action: "Registrar evidência",
  }),
  addMarketSample: {
    title: "Adicione uma amostra de mercado.",
    reason: "O gate de evidência do foco atual está satisfeito. Uma descrição de vaga real agora adiciona um sinal externo de demanda ao workspace.",
    action: "Adicionar vaga real",
  },
  continueRoadmap: (title) => ({
    title: `Continue ${title}.`,
    reason: "Baseline, evidência e contexto de mercado estão disponíveis. Continue trabalhando o foco atual do roadmap e volte aqui quando o estado mudar.",
    action: "Continuar no Roadmap",
  }),
};

export const careerGuidanceCopy: Readonly<
  Record<Locale, Readonly<{
    guide: CareerGuideCopy;
    orientation: CareerOrientationCopy;
    nextAction: CareerNextActionCopy;
  }>>
> = {
  en: { guide: enGuide, orientation: enOrientation, nextAction: enNextAction },
  "pt-BR": { guide: ptBrGuide, orientation: ptBrOrientation, nextAction: ptBrNextAction },
};
