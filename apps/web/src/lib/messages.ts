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
        "This foundation release establishes the bilingual experience. Search and skill detail pages arrive in later releases.",
    },
    catalog: {
      skillsCount: "skills",
      packsCount: "packs",
      localesCount: "locales",
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
        "Esta entrega de fundação estabelece a experiência bilíngue. Busca e detalhes das skills chegam em entregas futuras.",
    },
    catalog: {
      skillsCount: "skills",
      packsCount: "pacotes",
      localesCount: "idiomas",
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
