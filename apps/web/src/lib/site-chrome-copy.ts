import type { Locale } from "./locales";

export type SiteChromeContextKey =
  | "skills"
  | "packs"
  | "gettingStarted"
  | "builtWithSkills"
  | "roadmap"
  | "about";

type SiteChromeCopy = Readonly<{
  header: Readonly<{
    index: string;
    indexTitle: string;
    indexSummary: string;
    collectionLabel: string;
    versionLabel: string;
    contexts: Readonly<Record<SiteChromeContextKey, Readonly<{
      kicker: string;
      summary: string;
    }>>>;
  }>;
  footer: Readonly<{
    eyebrow: string;
    manifesto: string;
    summary: string;
    explore: string;
    project: string;
    source: string;
    collection: string;
  }>;
}>;

export const siteChromeCopy: Readonly<Record<Locale, SiteChromeCopy>> = {
  en: {
    header: {
      index: "INDEX",
      indexTitle: "Index of the Studio",
      indexSummary: "Move between skills, packs, installation, real-use evidence, and the public state of the project.",
      collectionLabel: "COLLECTION",
      versionLabel: "VERSION",
      contexts: {
        skills: {
          kicker: "METHOD LIBRARY",
          summary: "A skill is a reusable working method an agent can apply to a specific kind of work.",
        },
        packs: {
          kicker: "RELATED METHODS",
          summary: "A pack groups related skills without turning them into one workflow; every method remains independently invokable.",
        },
        gettingStarted: {
          kicker: "INSTALLATION",
          summary: "Install one skill, one pack, or the collection, then verify what your runtime can discover.",
        },
        builtWithSkills: {
          kicker: "REAL-USE EVIDENCE",
          summary: "Inspect real projects, the skills used, and the evidence left after the work shipped.",
        },
        roadmap: {
          kicker: "OPEN DEVELOPMENT",
          summary: "Release status and individual skill maturity are tracked separately and advance only with evidence.",
        },
        about: {
          kicker: "STUDIO NOTES",
          summary: "Why the collection exists, how methods are scoped, and what the project treats as evidence.",
        },
      },
    },
    footer: {
      eyebrow: "END MATTER / OPEN METHODS",
      manifesto: "Methods only matter when they change the work.",
      summary: "Agent Skills Studio is an open, versioned, installable collection of working methods for agents.",
      explore: "Explore",
      project: "Project",
      source: "Source",
      collection: "Collection",
    },
  },
  "pt-BR": {
    header: {
      index: "INDEX",
      indexTitle: "Índice do Studio",
      indexSummary: "Navegue entre skills, packs, instalação, evidências de uso real e o estado público do projeto.",
      collectionLabel: "COLEÇÃO",
      versionLabel: "VERSÃO",
      contexts: {
        skills: {
          kicker: "BIBLIOTECA DE MÉTODOS",
          summary: "Uma skill é um método de trabalho reutilizável que um agente pode aplicar a um tipo específico de trabalho.",
        },
        packs: {
          kicker: "MÉTODOS RELACIONADOS",
          summary: "Um pack agrupa skills relacionadas sem transformá-las em um fluxo único; cada método continua invocável de forma independente.",
        },
        gettingStarted: {
          kicker: "INSTALAÇÃO",
          summary: "Instale uma skill, um pack ou a coleção e depois verifique o que seu runtime consegue descobrir.",
        },
        builtWithSkills: {
          kicker: "EVIDÊNCIA DE USO REAL",
          summary: "Inspecione projetos reais, as skills usadas e as evidências que ficaram depois da entrega.",
        },
        roadmap: {
          kicker: "DESENVOLVIMENTO ABERTO",
          summary: "O status da release e a maturidade das skills são acompanhados separadamente e só avançam com evidência.",
        },
        about: {
          kicker: "NOTAS DO STUDIO",
          summary: "Por que a coleção existe, como os métodos são delimitados e o que o projeto trata como evidência.",
        },
      },
    },
    footer: {
      eyebrow: "END MATTER / MÉTODOS ABERTOS",
      manifesto: "Métodos só têm valor quando mudam o trabalho.",
      summary: "Agent Skills Studio é uma coleção aberta, versionada e instalável de métodos de trabalho para agentes.",
      explore: "Explorar",
      project: "Projeto",
      source: "Origem",
      collection: "Coleção",
    },
  },
};
