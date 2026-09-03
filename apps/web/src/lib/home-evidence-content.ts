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
      summary:
        "We used the collection on the Studio itself: diagnose the hierarchy, choose the methods, implement the redesign, then verify what changed.",
      stages: [
        {
          id: "problem",
          eyebrow: "01 / Problem",
          title: "The interface worked. The hierarchy did not.",
          summary:
            "Content was compressed into the hero, visual priority was weak, and the product looked less deliberate than the methods it publishes.",
        },
        {
          id: "method",
          eyebrow: "02 / Method",
          title: "The methods set the order of work.",
          summary:
            "Research and design approval came before implementation; responsive, visual, motion, and accessibility checks defined what counted as done.",
        },
        {
          id: "transformation",
          eyebrow: "03 / Transformation",
          title: "Hierarchy before effects.",
          summary:
            "Typography, spacing, grid, and the Dark Veil atmosphere were rebuilt around clearer reading order instead of adding decoration to the old composition.",
        },
        {
          id: "evidence",
          eyebrow: "04 / Evidence",
          title: "The result is inspectable.",
          summary:
            "The redesign shipped with reduced-motion support, responsive checks, tests, and repository history that can be inspected independently of this page.",
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
      summary:
        "The collection is more credible when the same methods used to describe good work can be inspected in the work behind this site.",
      challengeLabel: "Challenge",
      challenge:
        "The Home was functional, but compressed hierarchy and weak differentiation made the product harder to read and easier to mistake for a generic catalog.",
      skillsLabel: "Skills used",
      outcomeLabel: "Outcome",
      outcome:
        "An editorial, responsive hero with React Bits Dark Veil, clearer composition, reduced-motion support, and visual QA.",
      evidenceLabel: "Evidence",
      evidence: ["PR #22", "3 production files changed", "Tests passed", "390 / 1440 / 1920 visual QA"],
      beforeLabel: "Before",
      afterLabel: "After",
      viewCases: "Inspect all evidence",
    },
    transformation: {
      eyebrow: "Method in action",
      title: "The file is not the value. The process is.",
      summary:
        "A skill matters when it changes how the agent frames the problem, makes decisions, and verifies the result.",
      stages: [
        {
          title: "Name the problem",
          summary:
            "The layout was usable, but cramped hierarchy and weak differentiation made the result feel generic.",
        },
        {
          title: "Apply the method",
          summary:
            "Research, design approval, implementation, visual QA, and accessibility constraints gave the work an explicit sequence.",
        },
        {
          title: "Verify the result",
          summary:
            "The revised hero shipped with responsive behavior, reduced-motion support, tests, and reproducible visual QA.",
        },
      ],
    },
    methods: {
      eyebrow: "Open methods",
      title: "Choose the method that matches the work.",
      summary:
        "Each skill is open to inspection. Read its trigger, constraints, process, and boundaries before deciding whether it belongs in your agent workflow.",
      viewAll: "Explore all skills",
      featured: [
        { slug: "designing-ui-systems", discipline: "Interface systems · hierarchy · composition" },
        { slug: "building-premium-nextjs-interfaces", discipline: "Next.js · React · architecture · frontend craft" },
        { slug: "craft-premium-motion", discipline: "Animation · interaction · motion direction" },
      ],
    },
    packs: {
      eyebrow: "Featured packs",
      title: "Use a pack when the work crosses methods.",
      summary:
        "Packs group related, independently invokable skills so you can install a useful discipline without turning it into one oversized workflow.",
      skills: "{count} skills",
      view: "Inspect pack",
      viewAll: "Explore all packs",
    },
    workflow: {
      eyebrow: "How it works",
      title: "Ask normally. Work with a method.",
      summary:
        "You describe the job in natural language. The skill gives the agent an explicit way to approach it instead of improvising the process from scratch.",
      movements: [
        {
          title: "Describe the job",
          summary: "State the goal and the context you already have. You do not need to rewrite the skill as a prompt.",
        },
        {
          title: "Match a method",
          summary: "The agent selects the skill whose trigger and boundaries fit the work.",
        },
        {
          title: "Follow the constraints",
          summary: "The method structures research, decisions, implementation, and verification where they are relevant.",
        },
        {
          title: "Inspect the outcome",
          summary: "The result should come with enough evidence to review what changed and how it was checked.",
        },
      ],
    },
    ledger: {
      eyebrow: "Evidence ledger",
      title: "Inspect the method. Then inspect what it changed.",
      summary:
        "Real-use records connect a skill to a project, the decisions it affected, and the evidence available after the work shipped.",
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
      summary:
        "Usamos a coleção no próprio Studio: diagnosticar a hierarquia, escolher os métodos, implementar o redesign e verificar o que realmente mudou.",
      stages: [
        {
          id: "problem",
          eyebrow: "01 / Problema",
          title: "A interface funcionava. A hierarquia, não.",
          summary:
            "O conteúdo estava comprimido na hero, a prioridade visual era fraca e o produto parecia menos deliberado que os métodos que publica.",
        },
        {
          id: "method",
          eyebrow: "02 / Método",
          title: "Os métodos definiram a ordem do trabalho.",
          summary:
            "Pesquisa e aprovação de design vieram antes da implementação; checks responsivos, visuais, de motion e acessibilidade definiram o que significava terminar.",
        },
        {
          id: "transformation",
          eyebrow: "03 / Transformação",
          title: "Hierarquia antes dos efeitos.",
          summary:
            "Tipografia, espaçamento, grid e a atmosfera do Dark Veil foram refeitos em torno de uma ordem de leitura mais clara, em vez de decorar a composição antiga.",
        },
        {
          id: "evidence",
          eyebrow: "04 / Evidência",
          title: "O resultado pode ser inspecionado.",
          summary:
            "O redesign foi entregue com suporte a reduced motion, checks responsivos, testes e histórico no repositório que podem ser verificados sem depender desta página.",
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
      summary:
        "A coleção ganha credibilidade quando os mesmos métodos usados para descrever um bom trabalho podem ser inspecionados no trabalho por trás deste site.",
      challengeLabel: "Desafio",
      challenge:
        "A Home era funcional, mas a hierarquia comprimida e a pouca diferenciação tornavam o produto mais difícil de ler e fácil de confundir com um catálogo genérico.",
      skillsLabel: "Skills usadas",
      outcomeLabel: "Resultado",
      outcome:
        "Uma hero editorial e responsiva com Dark Veil do React Bits, composição mais clara, reduced motion e QA visual.",
      evidenceLabel: "Evidência",
      evidence: ["PR #22", "3 arquivos de produção alterados", "Testes aprovados", "QA visual em 390 / 1440 / 1920"],
      beforeLabel: "Antes",
      afterLabel: "Depois",
      viewCases: "Inspecionar todas as evidências",
    },
    transformation: {
      eyebrow: "Método em ação",
      title: "O valor não está no arquivo. Está no processo.",
      summary:
        "Uma skill importa quando muda a forma como o agente enquadra o problema, toma decisões e verifica o resultado.",
      stages: [
        {
          title: "Nomeie o problema",
          summary:
            "O layout era utilizável, mas a hierarquia apertada e a pouca diferenciação faziam o resultado parecer genérico.",
        },
        {
          title: "Aplique o método",
          summary:
            "Pesquisa, aprovação de design, implementação, QA visual e acessibilidade deram ao trabalho uma sequência explícita.",
        },
        {
          title: "Verifique o resultado",
          summary:
            "A hero revisada foi entregue com comportamento responsivo, reduced motion, testes e QA visual reproduzível.",
        },
      ],
    },
    methods: {
      eyebrow: "Métodos abertos",
      title: "Escolha o método que corresponde ao trabalho.",
      summary:
        "Cada skill está aberta para inspeção. Leia seu gatilho, restrições, processo e limites antes de decidir se ela faz sentido no fluxo do seu agente.",
      viewAll: "Explorar todas as skills",
      featured: [
        { slug: "designing-ui-systems", discipline: "Sistemas de interface · hierarquia · composição" },
        { slug: "building-premium-nextjs-interfaces", discipline: "Next.js · React · arquitetura · frontend craft" },
        { slug: "craft-premium-motion", discipline: "Animação · interação · direção de motion" },
      ],
    },
    packs: {
      eyebrow: "Packs em destaque",
      title: "Use um pack quando o trabalho atravessa vários métodos.",
      summary:
        "Packs agrupam skills relacionadas e invocáveis de forma independente para você instalar uma disciplina útil sem transformá-la em um único workflow gigante.",
      skills: "{count} skills",
      view: "Inspecionar pack",
      viewAll: "Explorar todos os packs",
    },
    workflow: {
      eyebrow: "Como funciona",
      title: "Peça normalmente. Trabalhe com um método.",
      summary:
        "Você descreve o trabalho em linguagem natural. A skill dá ao agente uma forma explícita de abordá-lo em vez de improvisar o processo do zero.",
      movements: [
        {
          title: "Descreva o trabalho",
          summary: "Informe o objetivo e o contexto que você já tem. Não é preciso reescrever a skill como um prompt.",
        },
        {
          title: "Encontre o método",
          summary: "O agente seleciona a skill cujo gatilho e limites correspondem ao trabalho.",
        },
        {
          title: "Siga as restrições",
          summary: "O método estrutura pesquisa, decisões, implementação e verificação onde cada etapa for relevante.",
        },
        {
          title: "Inspecione o resultado",
          summary: "O resultado deve trazer evidência suficiente para revisar o que mudou e como foi verificado.",
        },
      ],
    },
    ledger: {
      eyebrow: "Registro de evidências",
      title: "Inspecione o método. Depois, inspecione o que ele mudou.",
      summary:
        "Os registros de uso real conectam uma skill ao projeto, às decisões que ela afetou e às evidências disponíveis depois da entrega.",
      methodLabel: "Método",
      usedInLabel: "Usado em",
      evidenceLabel: "Evidência",
      viewAll: "Ver todos os cases",
    },
  },
} satisfies Record<Locale, HomeEvidenceCopy>;
