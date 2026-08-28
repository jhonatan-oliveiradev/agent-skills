import type { Locale } from "./locales";

export interface Messages {
  readonly skipLink: string;
  readonly brandLabel: string;
  readonly navigation: {
    readonly label: string;
    readonly skills: string;
    readonly packs: string;
    readonly gettingStarted: string;
    readonly builtWithSkills: string;
    readonly roadmap: string;
    readonly about: string;
    readonly contribute: string;
    readonly changelog: string;
  };
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly summary: string;
    readonly primaryAction: string;
    readonly secondaryAction: string;
    readonly foundationNote: string;
  };
  readonly catalog: {
    readonly skillsCount: string;
    readonly packsCount: string;
    readonly localesCount: string;
  };
  readonly skillsCatalog: {
    readonly searchLabel: string;
    readonly searchPlaceholder: string;
    readonly category: string;
    readonly pack: string;
    readonly difficulty: string;
    readonly maturity: string;
    readonly all: string;
    readonly results: string;
    readonly noResultsTitle: string;
    readonly noResultsSummary: string;
    readonly clear: string;
    readonly benefit: string;
    readonly tags: string;
    readonly loading: string;
    readonly values: Readonly<Record<"advanced" | "intermediate" | "stable", string>>;
    readonly categories: Readonly<Record<string, string>>;
  };
  readonly skillDetail: {
    readonly back: string;
    readonly benefit: string;
    readonly whenToUse: string;
    readonly whenNotToUse: string;
    readonly useCases: string;
    readonly examplePrompts: string;
    readonly compatibility: string;
    readonly surfaces: string;
    readonly operatingSystems: string;
    readonly installModes: string;
    readonly dependencies: string;
    readonly noDependencies: string;
    readonly relatedSkills: string;
    readonly packs: string;
    readonly installation: string;
    readonly installationSummary: string;
    readonly bash: string;
    readonly powershell: string;
    readonly copy: string;
    readonly copied: string;
    readonly source: string;
    readonly version: string;
    readonly updated: string;
    readonly notFoundTitle: string;
    readonly notFoundSummary: string;
  };
  readonly process: {
    readonly title: string;
    readonly summary: string;
    readonly choose: {
      readonly title: string;
      readonly summary: string;
    };
    readonly install: {
      readonly title: string;
      readonly summary: string;
    };
    readonly invoke: {
      readonly title: string;
      readonly summary: string;
    };
  };
  readonly locale: {
    readonly label: string;
    readonly en: string;
    readonly ptBR: string;
    readonly switchTo: string;
  };
  readonly theme: {
    readonly label: string;
    readonly light: string;
    readonly dark: string;
    readonly system: string;
  };
  readonly footer: {
    readonly summary: string;
    readonly source: string;
    readonly contribute: string;
    readonly version: string;
    readonly navigationLabel: string;
  };
  readonly metadata: {
    readonly title: string;
    readonly description: string;
  };
  readonly foundation: {
    readonly eyebrow: string;
    readonly note: string;
    readonly skills: {
      readonly title: string;
      readonly summary: string;
    };
    readonly packs: {
      readonly title: string;
      readonly summary: string;
    };
    readonly roadmap: {
      readonly title: string;
      readonly summary: string;
    };
    readonly about: {
      readonly title: string;
      readonly summary: string;
    };
  };
}

export const messages = {
  en: {
    skipLink: "Skip to content",
    brandLabel: "Agent Skills Studio",
    navigation: {
      label: "Primary navigation",
      skills: "Explore skills",
      packs: "Packs",
      gettingStarted: "Getting started",
      builtWithSkills: "Built with skills",
      roadmap: "Roadmap",
      about: "About",
      contribute: "Contribute",
      changelog: "Changelog",
    },
    hero: {
      eyebrow: "Agent Skills Studio",
      title: "Composable skills for capable agents.",
      summary: "Browse production-ready skills and packs for building better agents.",
      primaryAction: "Explore skills",
      secondaryAction: "View packs",
      foundationNote:
        "Explore the searchable catalog now. Skill detail pages arrive in a later release.",
    },
    catalog: {
      skillsCount: "skills",
      packsCount: "packs",
      localesCount: "locales",
    },
    skillsCatalog: {
      searchLabel: "Search skills",
      searchPlaceholder: "Search by name, outcome, or tag",
      category: "Category",
      pack: "Pack",
      difficulty: "Difficulty",
      maturity: "Maturity",
      all: "All",
      results: "{count} skills found",
      noResultsTitle: "No skills found",
      noResultsSummary: "Try a broader search or remove one of the active filters.",
      clear: "Clear filters",
      benefit: "Primary benefit",
      tags: "Tags",
      loading: "Loading catalog…",
      values: { advanced: "Advanced", intermediate: "Intermediate", stable: "Stable" },
      categories: {
        delivery: "Delivery",
        frontend: "Frontend",
        "game-development": "Game development",
        meta: "Meta",
        motion: "Motion",
        "product-design": "Product design",
      },
    },
    skillDetail: {
      back: "Back to skills",
      benefit: "Primary benefit",
      whenToUse: "When to use",
      whenNotToUse: "When not to use",
      useCases: "Use cases",
      examplePrompts: "Example prompts",
      compatibility: "Compatibility",
      surfaces: "Surfaces",
      operatingSystems: "Operating systems",
      installModes: "Install modes",
      dependencies: "Dependencies",
      noDependencies: "No external dependencies",
      relatedSkills: "Related skills",
      packs: "Included in packs",
      installation: "Install this skill",
      installationSummary: "Choose the command for your operating system and run it from the repository root.",
      bash: "Bash",
      powershell: "PowerShell",
      copy: "Copy",
      copied: "Copied",
      source: "View canonical source on GitHub",
      version: "Version",
      updated: "Updated",
      notFoundTitle: "Skill not found",
      notFoundSummary: "This skill does not exist in the current catalog or is no longer available.",
    },
    process: {
      title: "Choose → install → invoke",
      summary: "A short path from the right workflow to a more capable agent.",
      choose: {
        title: "Choose",
        summary: "Start with the outcome you need, then select a focused skill or pack.",
      },
      install: {
        title: "Install",
        summary: "Add the collection, one pack, or one skill to a compatible environment.",
      },
      invoke: {
        title: "Invoke",
        summary: "Describe the task naturally so your agent can apply the workflow.",
      },
    },
    locale: {
      label: "Language",
      en: "English",
      ptBR: "Português (Brasil)",
      switchTo: "Switch language to {language}",
    },
    theme: {
      label: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    footer: {
      summary: "Open skills for building useful agents.",
      source: "Source on GitHub",
      contribute: "Contribute on GitHub",
      version: "Version {version}",
      navigationLabel: "Footer navigation",
    },
    metadata: {
      title: "Composable agent skills",
      description: "Build capable agents with production-ready, composable workflows.",
    },
    foundation: {
      eyebrow: "Foundation route",
      note:
        "This foundation route is live and localized. Full catalog features are coming in the next release.",
      skills: {
        title: "Skills",
        summary: "Focused workflows for design, engineering, motion, games, and product work.",
      },
      packs: {
        title: "Packs",
        summary: "Curated groups of complementary skills organized around a practical goal.",
      },
      roadmap: {
        title: "Roadmap",
        summary: "A transparent view of the collection's planned areas and future capabilities.",
      },
      about: {
        title: "About",
        summary: "Why Agent Skills Studio exists and how its open workflows are maintained.",
      },
    },
  },
  "pt-BR": {
    skipLink: "Pular para o conteúdo",
    brandLabel: "Agent Skills Studio",
    navigation: {
      label: "Navegação principal",
      skills: "Explorar skills",
      packs: "Pacotes",
      gettingStarted: "Primeiros passos",
      builtWithSkills: "Feito com habilidades",
      roadmap: "Roteiro",
      about: "Sobre",
      contribute: "Contribuir",
      changelog: "Registro de alterações",
    },
    hero: {
      eyebrow: "Agent Skills Studio",
      title: "Habilidades combináveis para agentes capazes.",
      summary: "Explore habilidades e pacotes prontos para produzir agentes melhores.",
      primaryAction: "Explorar skills",
      secondaryAction: "Ver pacotes",
      foundationNote:
        "Explore agora o catálogo com busca. As páginas de detalhes das skills chegam em uma entrega futura.",
    },
    catalog: {
      skillsCount: "skills",
      packsCount: "pacotes",
      localesCount: "idiomas",
    },
    skillsCatalog: {
      searchLabel: "Buscar skills",
      searchPlaceholder: "Busque por nome, resultado ou tag",
      category: "Categoria",
      pack: "Pacote",
      difficulty: "Dificuldade",
      maturity: "Maturidade",
      all: "Todos",
      results: "{count} skills encontradas",
      noResultsTitle: "Nenhuma skill encontrada",
      noResultsSummary: "Tente uma busca mais ampla ou remova um dos filtros ativos.",
      clear: "Limpar filtros",
      benefit: "Principal benefício",
      tags: "Tags",
      loading: "Carregando catálogo…",
      values: { advanced: "Avançada", intermediate: "Intermediária", stable: "Estável" },
      categories: {
        delivery: "Entrega",
        frontend: "Frontend",
        "game-development": "Desenvolvimento de jogos",
        meta: "Meta",
        motion: "Motion",
        "product-design": "Design de produto",
      },
    },
    skillDetail: {
      back: "Voltar para skills",
      benefit: "Principal benefício",
      whenToUse: "Quando usar",
      whenNotToUse: "Quando não usar",
      useCases: "Casos de uso",
      examplePrompts: "Prompts de exemplo",
      compatibility: "Compatibilidade",
      surfaces: "Ambientes",
      operatingSystems: "Sistemas operacionais",
      installModes: "Modos de instalação",
      dependencies: "Dependências",
      noDependencies: "Sem dependências externas",
      relatedSkills: "Skills relacionadas",
      packs: "Incluída nos pacotes",
      installation: "Instale esta skill",
      installationSummary: "Escolha o comando do seu sistema operacional e execute na raiz do repositório.",
      bash: "Bash",
      powershell: "PowerShell",
      copy: "Copiar",
      copied: "Copiado",
      source: "Ver fonte canônica no GitHub",
      version: "Versão",
      updated: "Atualizada em",
      notFoundTitle: "Skill não encontrada",
      notFoundSummary: "Esta skill não existe no catálogo atual ou não está mais disponível.",
    },
    process: {
      title: "Escolha → instale → invoque",
      summary: "Um caminho curto do fluxo certo até um agente mais capaz.",
      choose: {
        title: "Escolha",
        summary: "Comece pelo resultado desejado e selecione uma skill ou um pacote focado.",
      },
      install: {
        title: "Instale",
        summary: "Adicione a coleção, um pacote ou uma skill a um ambiente compatível.",
      },
      invoke: {
        title: "Invoque",
        summary: "Descreva a tarefa naturalmente para seu agente aplicar o fluxo.",
      },
    },
    locale: {
      label: "Idioma",
      en: "English",
      ptBR: "Português (Brasil)",
      switchTo: "Mudar idioma para {language}",
    },
    theme: {
      label: "Tema",
      light: "Claro",
      dark: "Escuro",
      system: "Sistema",
    },
    footer: {
      summary: "Habilidades abertas para criar agentes úteis.",
      source: "Código-fonte no GitHub",
      contribute: "Contribuir no GitHub",
      version: "Versão {version}",
      navigationLabel: "Navegação do rodapé",
    },
    metadata: {
      title: "Skills combináveis para agentes",
      description: "Crie agentes capazes com fluxos combináveis e prontos para produção.",
    },
    foundation: {
      eyebrow: "Base desta rota",
      note:
        "A base desta rota está ativa e localizada. Os recursos completos do catálogo chegam na próxima entrega.",
      skills: {
        title: "Habilidades",
        summary: "Fluxos focados para design, engenharia, motion, games e trabalho de produto.",
      },
      packs: {
        title: "Pacotes",
        summary: "Grupos selecionados de skills complementares organizados por objetivo prático.",
      },
      roadmap: {
        title: "Roteiro",
        summary: "Uma visão transparente das áreas planejadas e capacidades futuras da coleção.",
      },
      about: {
        title: "Sobre",
        summary: "Por que o Agent Skills Studio existe e como seus fluxos abertos são mantidos.",
      },
    },
  },
} satisfies Record<Locale, Messages>;
