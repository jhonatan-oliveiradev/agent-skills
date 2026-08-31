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
      indexSummary: "Navigate methods, proof, installation, and the public development of the collection.",
      collectionLabel: "COLLECTION",
      versionLabel: "VERSION",
      contexts: {
        skills: {
          kicker: "METHOD LIBRARY",
          summary: "Versioned methods for design, frontend, motion, delivery, and agent work.",
        },
        packs: {
          kicker: "COMPOSED WORKFLOWS",
          summary: "Curated sets of complementary skills organized around a practical outcome.",
        },
        gettingStarted: {
          kicker: "INSTALLATION",
          summary: "Install one method, one pack, or the complete collection and verify what your agent can discover.",
        },
        builtWithSkills: {
          kicker: "PROOF IN PRACTICE",
          summary: "Real product work, decisions, and evidence created with the collection.",
        },
        roadmap: {
          kicker: "OPEN DEVELOPMENT",
          summary: "Status follows evidence, from proposal to stable.",
        },
        about: {
          kicker: "STUDIO NOTES",
          summary: "The principles, provenance, and intent behind an open library of working methods.",
        },
      },
    },
    footer: {
      eyebrow: "END MATTER / OPEN METHODS",
      manifesto: "Methods only matter when they change the work.",
      summary: "Agent Skills Studio is an open, versioned collection of working methods for capable agents.",
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
      indexSummary: "Navegue por métodos, evidências, instalação e pelo desenvolvimento público da coleção.",
      collectionLabel: "COLEÇÃO",
      versionLabel: "VERSÃO",
      contexts: {
        skills: {
          kicker: "BIBLIOTECA DE MÉTODOS",
          summary: "Métodos versionados para design, frontend, motion, delivery e trabalho com agentes.",
        },
        packs: {
          kicker: "FLUXOS COMPOSTOS",
          summary: "Conjuntos curados de skills complementares organizados em torno de um resultado prático.",
        },
        gettingStarted: {
          kicker: "INSTALAÇÃO",
          summary: "Instale um método, um pacote ou a coleção completa e valide o que seu agente consegue descobrir.",
        },
        builtWithSkills: {
          kicker: "PROVA NA PRÁTICA",
          summary: "Trabalho real, decisões e evidências criadas com a coleção.",
        },
        roadmap: {
          kicker: "DESENVOLVIMENTO ABERTO",
          summary: "O status segue evidências, da proposta ao estável.",
        },
        about: {
          kicker: "NOTAS DO STUDIO",
          summary: "Os princípios, a origem e a intenção por trás de uma biblioteca aberta de métodos de trabalho.",
        },
      },
    },
    footer: {
      eyebrow: "END MATTER / MÉTODOS ABERTOS",
      manifesto: "Métodos só têm valor quando mudam o trabalho.",
      summary: "Agent Skills Studio é uma coleção aberta e versionada de métodos de trabalho para agentes capazes.",
      explore: "Explorar",
      project: "Projeto",
      source: "Origem",
      collection: "Coleção",
    },
  },
};
