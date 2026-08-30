import type { Locale } from "./locales";

export type HomeCaseStageId = "problem" | "method" | "transformation" | "evidence";

export type HomeCaseStage = Readonly<{
  id: HomeCaseStageId;
  eyebrow: string;
  title: string;
  summary: string;
}>;

type HomeAct = Readonly<{
  id: "manifesto-case" | "methods-systems" | "proof-open-system";
  label: string;
}>;

export type HomeEvidenceCopy = Readonly<{
  acts: readonly [HomeAct, HomeAct, HomeAct];
  caseStudy: Readonly<{
    eyebrow: string;
    title: string;
    summary: string;
    stages: readonly [HomeCaseStage, HomeCaseStage, HomeCaseStage, HomeCaseStage];
    evidence: readonly string[];
    beforeLabel: string;
    afterLabel: string;
    viewCases: string;
  }>;
  proof: Readonly<{
    eyebrow: string;
    title: string;
    summary: string;
    challengeLabel: string;
    challenge: string;
    skillsLabel: string;
    outcomeLabel: string;
    outcome: string;
    evidenceLabel: string;
    evidence: readonly string[];
    beforeLabel: string;
    afterLabel: string;
    viewCases: string;
  }>;
  transformation: Readonly<{
    eyebrow: string;
    title: string;
    summary: string;
    stages: readonly [
      Readonly<{ title: string; summary: string }>,
      Readonly<{ title: string; summary: string }>,
      Readonly<{ title: string; summary: string }>,
    ];
  }>;
  methods: Readonly<{
    eyebrow: string;
    title: string;
    summary: string;
    viewAll: string;
    featured: readonly [
      Readonly<{ slug: "designing-ui-systems"; discipline: string }>,
      Readonly<{ slug: "building-premium-nextjs-interfaces"; discipline: string }>,
      Readonly<{ slug: "craft-premium-motion"; discipline: string }>,
    ];
  }>;
  packs: Readonly<{
    eyebrow: string;
    title: string;
    summary: string;
    skills: string;
    view: string;
    viewAll: string;
  }>;
  workflow: Readonly<{
    eyebrow: string;
    title: string;
    summary: string;
    movements: readonly [
      Readonly<{ title: string; summary: string }>,
      Readonly<{ title: string; summary: string }>,
      Readonly<{ title: string; summary: string }>,
      Readonly<{ title: string; summary: string }>,
    ];
  }>;
  ledger: Readonly<{
    eyebrow: string;
    title: string;
    summary: string;
    methodLabel: string;
    usedInLabel: string;
    evidenceLabel: string;
    viewAll: string;
  }>;
}>;

export const homeEvidenceContent = {
  en: {
    acts: [
      { id: "manifesto-case", label: "Manifesto / Case 001" },
      { id: "methods-systems", label: "Methods / Systems" },
      { id: "proof-open-system", label: "Proof / Open system" },
    ],
    caseStudy: {
      eyebrow: "Built with Skills / Case 001",
      title: "This Home was built with Skills.",
      summary: "The thesis should survive contact with the product. This interface is the first proof: method in, verifiable outcome out.",
      stages: [
        {
          id: "problem",
          eyebrow: "01 / Problem",
          title: "The interface worked. The authorship did not.",
          summary: "The hierarchy felt compressed and the product did not yet look as deliberate as the methods it publishes.",
        },
        {
          id: "method",
          eyebrow: "02 / Method",
          title: "The method changed the process.",
          summary: "Research, design approval, implementation, visual QA and accessibility constraints shaped the work instead of decoration-first iteration.",
        },
        {
          id: "transformation",
          eyebrow: "03 / Transformation",
          title: "Structure before spectacle.",
          summary: "Typography, spacing, grid and the Dark Veil atmosphere were recomposed around a clearer editorial hierarchy and responsive behavior.",
        },
        {
          id: "evidence",
          eyebrow: "04 / Evidence",
          title: "The result can be inspected.",
          summary: "The redesigned hero shipped with reduced-motion support, responsive QA and repository evidence instead of an unverifiable marketing claim.",
        },
      ],
      evidence: ["PR #22", "3 production files changed", "Tests passed", "390 / 1440 / 1920 visual QA"],
      beforeLabel: "Before",
      afterLabel: "After",
      viewCases: "Inspect all evidence",
    },
    proof: {
      eyebrow: "Built with Skills / Case 001",
      title: "This Home was built with Skills.",
      summary: "The thesis should survive contact with the product. This interface is the first proof: method in, verifiable outcome out.",
      challengeLabel: "Challenge",
      challenge: "The Home worked, but its hierarchy felt compressed and the product did not yet look as deliberate as the methods it publishes.",
      skillsLabel: "Skills used",
      outcomeLabel: "Outcome",
      outcome: "An editorial, responsive hero with React Bits Dark Veil, clearer composition, reduced-motion support and visual QA.",
      evidenceLabel: "Evidence",
      evidence: ["PR #22", "3 production files changed", "Tests passed", "390 / 1440 / 1920 visual QA"],
      beforeLabel: "Before",
      afterLabel: "After",
      viewCases: "Inspect all evidence",
    },
    transformation: {
      eyebrow: "Method in action",
      title: "From a problem to an outcome.",
      summary: "The value is not the instruction file. The value is the decision process it makes repeatable.",
      stages: [
        { title: "Problem identified", summary: "The layout was usable, but cramped hierarchy and weak differentiation made the result feel generic." },
        { title: "Skills applied", summary: "Research, design approval, implementation, visual QA and accessibility constraints shaped the work." },
        { title: "Verifiable result", summary: "A stronger editorial hero shipped with responsive behavior, reduced-motion support and reproducible QA." },
      ],
    },
    methods: {
      eyebrow: "Open methods",
      title: "Explore the collection of methods.",
      summary: "Open the method, inspect the constraints and decide whether it belongs in your agent workflow.",
      viewAll: "View all skills",
      featured: [
        { slug: "designing-ui-systems", discipline: "Interface systems · hierarchy · composition" },
        { slug: "building-premium-nextjs-interfaces", discipline: "Next.js · React · architecture · frontend craft" },
        { slug: "craft-premium-motion", discipline: "Animation · interaction · motion direction" },
      ],
    },
    packs: {
      eyebrow: "Featured packs",
      title: "Methods that work better together.",
      summary: "Installable collections organized around outcomes instead of arbitrary bundles.",
      skills: "{count} skills",
      view: "Explore pack",
      viewAll: "View all packs",
    },
    workflow: {
      eyebrow: "How it works",
      title: "One method. Four movements.",
      summary: "The agent does not receive more decoration. It receives a better way to move from intent to evidence.",
      movements: [
        { title: "You ask", summary: "Describe the goal in natural language, with the context you already have." },
        { title: "The agent invokes", summary: "The agent selects the method that matches the work instead of improvising a process." },
        { title: "The method guides", summary: "Research, decisions, implementation and QA happen under explicit constraints." },
        { title: "You receive", summary: "You get an outcome that can be inspected, tested and reused." },
      ],
    },
    ledger: {
      eyebrow: "Evidence ledger",
      title: "Open the method. Inspect the evidence. Judge the result.",
      summary: "Trust should not depend on marketing copy. Every method becomes more useful when its use can be traced to real work.",
      methodLabel: "Method",
      usedInLabel: "Used in",
      evidenceLabel: "Evidence",
      viewAll: "Browse all cases",
    },
  },
  "pt-BR": {
    acts: [
      { id: "manifesto-case", label: "Manifesto / Case 001" },
      { id: "methods-systems", label: "Métodos / Sistemas" },
      { id: "proof-open-system", label: "Prova / Sistema aberto" },
    ],
    caseStudy: {
      eyebrow: "Built with Skills / Case 001",
      title: "Esta Home foi construída com Skills.",
      summary: "A tese precisa sobreviver ao contato com o produto. Esta interface é a primeira prova: entra método, sai resultado verificável.",
      stages: [
        {
          id: "problem",
          eyebrow: "01 / Problema",
          title: "A interface funcionava. A autoria ainda não.",
          summary: "A hierarquia estava comprimida e o produto ainda não parecia tão deliberado quanto os métodos que publica.",
        },
        {
          id: "method",
          eyebrow: "02 / Método",
          title: "O método mudou o processo.",
          summary: "Pesquisa, aprovação de design, implementação, QA visual e acessibilidade passaram a orientar o trabalho em vez de uma iteração centrada em decoração.",
        },
        {
          id: "transformation",
          eyebrow: "03 / Transformação",
          title: "Estrutura antes do espetáculo.",
          summary: "Tipografia, espaçamento, grid e a atmosfera do Dark Veil foram recompostos em torno de uma hierarquia editorial mais clara e responsiva.",
        },
        {
          id: "evidence",
          eyebrow: "04 / Evidência",
          title: "O resultado pode ser inspecionado.",
          summary: "A hero redesenhada foi entregue com reduced motion, QA responsivo e evidência no repositório em vez de uma promessa de marketing não verificável.",
        },
      ],
      evidence: ["PR #22", "3 arquivos de produção alterados", "Testes aprovados", "QA visual em 390 / 1440 / 1920"],
      beforeLabel: "Antes",
      afterLabel: "Depois",
      viewCases: "Inspecionar todas as evidências",
    },
    proof: {
      eyebrow: "Built with Skills / Case 001",
      title: "Esta Home foi construída com Skills.",
      summary: "A tese precisa sobreviver ao contato com o produto. Esta interface é a primeira prova: entra método, sai resultado verificável.",
      challengeLabel: "Desafio",
      challenge: "A Home funcionava, mas a hierarquia estava comprimida e o produto ainda não parecia tão deliberado quanto os métodos que publica.",
      skillsLabel: "Skills usadas",
      outcomeLabel: "Resultado",
      outcome: "Uma hero editorial e responsiva com Dark Veil do React Bits, composição mais clara, reduced motion e QA visual.",
      evidenceLabel: "Evidência",
      evidence: ["PR #22", "3 arquivos de produção alterados", "Testes aprovados", "QA visual em 390 / 1440 / 1920"],
      beforeLabel: "Antes",
      afterLabel: "Depois",
      viewCases: "Inspecionar todas as evidências",
    },
    transformation: {
      eyebrow: "Método em ação",
      title: "Do problema ao resultado.",
      summary: "O valor não está no arquivo de instruções. Está no processo de decisão que ele torna repetível.",
      stages: [
        { title: "Problema identificado", summary: "O layout era utilizável, mas a hierarquia apertada e a pouca diferenciação visual deixavam o resultado genérico." },
        { title: "Skills aplicadas", summary: "Pesquisa, aprovação de design, implementação, QA visual e acessibilidade passaram a orientar o trabalho." },
        { title: "Evidência verificável", summary: "Uma hero editorial mais forte foi entregue com responsividade, reduced motion e QA reproduzível." },
      ],
    },
    methods: {
      eyebrow: "Métodos abertos",
      title: "Explore a coleção de métodos.",
      summary: "Abra o método, inspecione as restrições e decida se ele merece fazer parte do fluxo do seu agente.",
      viewAll: "Ver todas as skills",
      featured: [
        { slug: "designing-ui-systems", discipline: "Sistemas de interface · hierarquia · composição" },
        { slug: "building-premium-nextjs-interfaces", discipline: "Next.js · React · arquitetura · frontend craft" },
        { slug: "craft-premium-motion", discipline: "Animação · interação · direção de motion" },
      ],
    },
    packs: {
      eyebrow: "Packs em destaque",
      title: "Métodos que trabalham melhor juntos.",
      summary: "Coleções instaláveis organizadas em torno de resultados, não de agrupamentos arbitrários.",
      skills: "{count} skills",
      view: "Explorar pack",
      viewAll: "Ver todos os packs",
    },
    workflow: {
      eyebrow: "Como funciona",
      title: "Um método. Quatro movimentos.",
      summary: "O agente não recebe mais decoração. Recebe uma forma melhor de sair da intenção e chegar à evidência.",
      movements: [
        { title: "Você pede", summary: "Descreva o objetivo em linguagem natural, com o contexto que você já possui." },
        { title: "O agente invoca", summary: "O agente escolhe o método adequado ao trabalho em vez de improvisar um processo." },
        { title: "O método guia", summary: "Pesquisa, decisões, implementação e QA acontecem sob restrições explícitas." },
        { title: "Você recebe", summary: "Você recebe um resultado que pode ser inspecionado, testado e reutilizado." },
      ],
    },
    ledger: {
      eyebrow: "Evidence ledger",
      title: "Abra o método. Inspecione a evidência. Julgue o resultado.",
      summary: "Confiança não deve depender da copy de marketing. Cada método fica mais valioso quando seu uso pode ser rastreado até trabalho real.",
      methodLabel: "Método",
      usedInLabel: "Usado em",
      evidenceLabel: "Evidência",
      viewAll: "Ver todos os cases",
    },
  },
} satisfies Record<Locale, HomeEvidenceCopy>;
