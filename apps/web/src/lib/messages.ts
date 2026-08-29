import type { Locale } from "./locales";

export interface Messages {
  readonly skipLink: string;
  readonly brandLabel: string;
  readonly navigation: {
    readonly label: string;
    readonly open: string;
    readonly close: string;
    readonly descriptor: string;
    readonly cta: string;
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
  };
  readonly home: {
    readonly paths: {
      readonly eyebrow: string;
      readonly title: string;
      readonly summary: string;
      readonly skills: { readonly title: string; readonly summary: string; readonly action: string };
      readonly packs: { readonly title: string; readonly summary: string; readonly action: string };
      readonly guide: { readonly title: string; readonly summary: string; readonly action: string };
    };
    readonly packs: { readonly eyebrow: string; readonly title: string; readonly summary: string; readonly view: string; readonly viewAll: string; readonly skills: string };
    readonly proof: { readonly eyebrow: string; readonly title: string; readonly summary: string; readonly view: string; readonly viewAll: string };
    readonly roadmap: { readonly eyebrow: string; readonly title: string; readonly summary: string; readonly action: string; readonly contribute: string };
  };
  readonly catalog: {
    readonly skillsCount: string;
    readonly packsCount: string;
    readonly localesCount: string;
  };
  readonly skillsCatalog: {
    readonly eyebrow: string;
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
  readonly packCatalog: {
    readonly eyebrow: string;
    readonly summary: string;
    readonly active: string;
    readonly planned: string;
    readonly skills: string;
    readonly compositionPending: string;
    readonly view: string;
  };
  readonly gettingStarted: {
    readonly eyebrow: string;
    readonly title: string;
    readonly summary: string;
    readonly bash: string;
    readonly powershell: string;
    readonly copy: string;
    readonly copied: string;
    readonly requirements: { readonly title: string; readonly items: readonly string[] };
    readonly install: { readonly title: string; readonly summary: string; readonly complete: string; readonly skill: string; readonly pack: string; readonly demoLabel: string; readonly demoSuccess: string };
    readonly verify: { readonly title: string; readonly summary: string; readonly commands: string };
    readonly maintenanceLabel: string;
    readonly update: { readonly title: string; readonly summary: string };
    readonly remove: { readonly title: string; readonly summary: string };
    readonly next: { readonly eyebrow: string; readonly title: string; readonly summary: string; readonly skills: string; readonly packs: string };
  };
  readonly builtWithSkills: {
    readonly eyebrow: string;
    readonly title: string;
    readonly summary: string;
    readonly casesLabel: string;
    readonly skillsApplied: string;
    readonly readCase: string;
    readonly back: string;
    readonly caseStudy: string;
    readonly published: string;
    readonly challenge: string;
    readonly workflowsTitle: string;
    readonly decisions: string;
    readonly decisionsTitle: string;
    readonly results: string;
    readonly resultsTitle: string;
    readonly evidence: string;
  };
  readonly roadmap: {
    readonly eyebrow: string;
    readonly principleLabel: string;
    readonly principle: string;
    readonly stages: readonly {
      readonly id: "proposal" | "research" | "development" | "experimental" | "beta" | "stable" | "deprecated";
      readonly title: string;
      readonly description: string;
      readonly empty: string;
    }[];
    readonly betaItems: readonly { readonly id: string; readonly title: string; readonly summary: string }[];
    readonly stableItem: { readonly title: string; readonly summary: string };
    readonly itemMeta: { readonly plannedPack: string; readonly stableSkills: string };
    readonly viewItem: string;
    readonly contributeLabel: string;
    readonly contributeTitle: string;
    readonly contributeSummary: string;
    readonly contributeAction: string;
  };
  readonly packDetail: {
    readonly back: string;
    readonly active: string;
    readonly planned: string;
    readonly outcomes: string;
    readonly composition: string;
    readonly skills: string;
    readonly version: string;
    readonly installation: string;
    readonly installationSummary: string;
    readonly plannedTitle: string;
    readonly plannedSummary: string;
    readonly bash: string;
    readonly powershell: string;
    readonly copy: string;
    readonly copied: string;
    readonly notFoundTitle: string;
    readonly notFoundSummary: string;
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
    readonly switchToLight: string;
    readonly switchToDark: string;
  };
  readonly footer: {
    readonly summary: string;
    readonly source: string;
    readonly contribute: string;
    readonly version: string;
    readonly navigationLabel: string;
    readonly signature: string;
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
      open: "Open navigation",
      close: "Close navigation",
      descriptor: "OPEN SKILLS · DESIGN · ENGINEERING",
      cta: "Start exploring",
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
    },
    home: {
      paths: {
        eyebrow: "One collection, three paths",
        title: "Choose the right starting point",
        summary: "Start with one focused workflow, a connected pack, or the complete installation guide.",
        skills: { title: "Find one precise skill", summary: "Search by outcome, category, difficulty, or maturity and install only the workflow you need.", action: "Browse the catalog" },
        packs: { title: "Adopt a connected workflow", summary: "Combine complementary skills in an ordered, installable pack built around a practical goal.", action: "Browse collections" },
        guide: { title: "Install with confidence", summary: "Follow the supported Bash or PowerShell path and verify what your agent can discover.", action: "Getting started" },
      },
      packs: {
        eyebrow: "Active packs",
        title: "Start with a connected workflow.",
        summary: "Three installable collections organize complementary skills without hiding their individual contracts.",
        view: "View pack",
        viewAll: "Explore all packs",
        skills: "{count} skills",
      },
      proof: {
        eyebrow: "Built with Skills",
        title: "Proof, not promises.",
        summary: "See how the collection shaped real product decisions and verifiable outcomes in Agent Skills Studio itself.",
        view: "Read case study",
        viewAll: "View all case studies",
      },
      roadmap: {
        eyebrow: "Open development",
        title: "Follow what is stable, beta, or still only a proposal.",
        summary: "The public roadmap separates shipped capabilities from planned directions and advances them through evidence.",
        action: "Read the roadmap",
        contribute: "Contribute to the collection",
      },
    },
    catalog: {
      skillsCount: "skills",
      packsCount: "packs",
      localesCount: "locales",
    },
    skillsCatalog: {
      eyebrow: "Skills catalog",
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
    packCatalog: {
      eyebrow: "Pack collection",
      summary: "Combine related skills into focused workflows, from product interfaces to motion and game development.",
      active: "Active",
      planned: "Planned",
      skills: "{count} skills",
      compositionPending: "Composition in progress",
      view: "View pack",
    },
    gettingStarted: {
      eyebrow: "Installation guide",
      title: "Getting started",
      summary: "Choose the scope you need, install it from the repository, and confirm that your agent can discover the workflows.",
      bash: "Bash · Linux, macOS, or WSL",
      powershell: "PowerShell · Windows",
      copy: "Copy",
      copied: "Copied",
      requirements: {
        title: "Before you begin",
        items: ["Node.js 20 or newer.", "Git and a local clone of the Agent Skills Studio repository.", "Codex or another runtime that discovers skills in ~/.agents/skills/."],
      },
      install: {
        title: "Install the complete collection",
        summary: "Run commands from the repository root. Choose the complete collection, a single skill, or an active pack.",
        complete: "Complete collection",
        skill: "One skill",
        pack: "One active pack",
        demoLabel: "Installation demonstration",
        demoSuccess: "18 skills ready to use.",
      },
      verify: {
        title: "Verify the installation",
        summary: "List the destination and confirm that the selected skill directories contain their canonical SKILL.md files.",
        commands: "Verification commands",
      },
      maintenanceLabel: "Maintenance",
      update: {
        title: "Update safely",
        summary: "Pull the latest repository changes, then run the same installer command again. Each selected skill is staged and replaced atomically.",
      },
      remove: {
        title: "Remove deliberately",
        summary: "Delete only the named skill directory from ~/.agents/skills/. Removing a pack means removing each skill that the pack installed; shared skills may still be used by another pack.",
      },
      next: {
        eyebrow: "Choose your workflow",
        title: "Start from the outcome you need.",
        summary: "Explore individual skills for precise control or install a curated pack for a connected workflow.",
        skills: "Explore skills",
        packs: "View packs",
      },
    },
    builtWithSkills: {
      eyebrow: "Proof in practice",
      title: "Built with Skills",
      summary: "Real product decisions and verifiable outcomes created by applying workflows from this collection to Agent Skills Studio itself.",
      casesLabel: "Built with Skills case studies",
      skillsApplied: "Skills applied",
      readCase: "Read case study",
      back: "Back to Built with Skills",
      caseStudy: "Case study",
      published: "Published",
      challenge: "The challenge",
      workflowsTitle: "Workflows behind the result",
      decisions: "Decisions",
      decisionsTitle: "From guidance to implementation",
      results: "Verifiable result",
      resultsTitle: "What shipped",
      evidence: "View evidence record",
    },
    roadmap: {
      eyebrow: "Public roadmap",
      principleLabel: "How to read it",
      principle: "Status reflects evidence, not aspiration. Initiatives move forward only after their purpose, implementation, and verification are clear enough for the next stage.",
      stages: [
        { id: "proposal", title: "Proposal", description: "A public direction open to concrete use cases and community input.", empty: "No initiatives in this stage." },
        { id: "research", title: "Research", description: "The problem, references, constraints, and viable approaches are being investigated.", empty: "No initiatives in this stage." },
        { id: "development", title: "In development", description: "The approved scope is being implemented and verified in focused slices.", empty: "No initiatives in this stage." },
        { id: "experimental", title: "Experimental", description: "The capability works, but its contract or fit may still change through real use.", empty: "No initiatives in this stage." },
        { id: "beta", title: "Beta", description: "The capability is available and versioned while release readiness is completed.", empty: "No initiatives in this stage." },
        { id: "stable", title: "Stable", description: "The contract is validated, documented, installable, and protected by project gates.", empty: "No initiatives in this stage." },
        { id: "deprecated", title: "Deprecated", description: "The capability is being retired with a documented replacement or migration path.", empty: "No initiatives in this stage." },
      ],
      betaItems: [
        { id: "plugin", title: "Agent Skills Studio plugin", summary: "Skills-only plugin and marketplace manifest with synchronized versioning and validation." },
        { id: "catalog", title: "Catalog and packs", summary: "Bilingual metadata, deterministic generation, active collections, and transparent planned packs." },
        { id: "installers", title: "Cross-platform installers", summary: "Atomic Bash and PowerShell installation for the collection, individual skills, and active packs." },
        { id: "microsite", title: "Bilingual microsite", summary: "A production site for discovery, installation guidance, case studies, and public project context." },
      ],
      stableItem: { title: "Stable skill collection", summary: "Every canonical skill currently published in the catalog is marked stable and available through supported installation paths." },
      itemMeta: { plannedPack: "Planned pack", stableSkills: "{count} stable skills" },
      viewItem: "View details",
      contributeLabel: "Community path",
      contributeTitle: "Help move a proposal forward.",
      contributeSummary: "Share a real use case, validation scenario, or implementation constraint in GitHub Issues. Evidence is what advances the roadmap.",
      contributeAction: "Open GitHub Issues",
    },
    packDetail: {
      back: "Back to packs",
      active: "Active",
      planned: "Planned",
      outcomes: "Expected outcomes",
      composition: "Pack composition",
      skills: "skills",
      version: "Version",
      installation: "Install this pack",
      installationSummary: "Run the command for your operating system from the repository root.",
      plannedTitle: "This pack is on the roadmap",
      plannedSummary: "Its skills will be added through public proposals and independent validation. Installation will become available only when the pack is active.",
      bash: "Bash",
      powershell: "PowerShell",
      copy: "Copy",
      copied: "Copied",
      notFoundTitle: "Pack not found",
      notFoundSummary: "This pack does not exist in the current collection or is no longer available.",
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
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
    footer: {
      summary: "Open skills for building useful agents.",
      source: "Source on GitHub",
      contribute: "Contribute on GitHub",
      version: "Version {version}",
      navigationLabel: "Footer navigation",
      signature: "Designed and built by Jhonatan Oliveira",
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
      open: "Abrir navegação",
      close: "Fechar navegação",
      descriptor: "SKILLS ABERTAS · DESIGN · ENGENHARIA",
      cta: "Começar a explorar",
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
    },
    home: {
      paths: {
        eyebrow: "Uma coleção, três caminhos",
        title: "Escolha o ponto de partida",
        summary: "Comece por um fluxo focado, um pacote conectado ou pelo guia completo de instalação.",
        skills: { title: "Encontre uma skill precisa", summary: "Busque por resultado, categoria, dificuldade ou maturidade e instale apenas o fluxo necessário.", action: "Abrir o catálogo" },
        packs: { title: "Adote um fluxo conectado", summary: "Combine skills complementares em um pacote ordenado e instalável, criado em torno de um objetivo prático.", action: "Explorar coleções" },
        guide: { title: "Instale com confiança", summary: "Siga o caminho suportado em Bash ou PowerShell e verifique o que seu agente consegue descobrir.", action: "Primeiros passos" },
      },
      packs: {
        eyebrow: "Pacotes ativos",
        title: "Comece por um fluxo conectado.",
        summary: "Três coleções instaláveis organizam skills complementares sem ocultar seus contratos individuais.",
        view: "Ver pacote",
        viewAll: "Explorar todos os pacotes",
        skills: "{count} skills",
      },
      proof: {
        eyebrow: "Feito com Skills",
        title: "Evidência, não promessas.",
        summary: "Veja como a coleção orientou decisões reais de produto e resultados verificáveis no próprio Agent Skills Studio.",
        view: "Ler estudo de caso",
        viewAll: "Ver todos os estudos de caso",
      },
      roadmap: {
        eyebrow: "Desenvolvimento aberto",
        title: "Acompanhe o que está estável, em beta ou ainda é apenas uma proposta.",
        summary: "O roteiro público separa capacidades entregues de direções planejadas e faz cada uma avançar por evidências.",
        action: "Ver o roteiro",
        contribute: "Contribuir com a coleção",
      },
    },
    catalog: {
      skillsCount: "skills",
      packsCount: "pacotes",
      localesCount: "idiomas",
    },
    skillsCatalog: {
      eyebrow: "Catálogo de skills",
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
    packCatalog: {
      eyebrow: "Coleção de pacotes",
      summary: "Combine skills relacionadas em fluxos focados, de interfaces de produto a motion e desenvolvimento de jogos.",
      active: "Ativo",
      planned: "Planejado",
      skills: "{count} skills",
      compositionPending: "Composição em definição",
      view: "Ver pacote",
    },
    gettingStarted: {
      eyebrow: "Guia de instalação",
      title: "Primeiros passos",
      summary: "Escolha o escopo necessário, instale a partir do repositório e confirme que seu agente consegue descobrir os fluxos.",
      bash: "Bash · Linux, macOS ou WSL",
      powershell: "PowerShell · Windows",
      copy: "Copiar",
      copied: "Copiado",
      requirements: {
        title: "Antes de começar",
        items: ["Node.js 20 ou mais recente.", "Git e um clone local do repositório Agent Skills Studio.", "Codex ou outro ambiente que descubra skills em ~/.agents/skills/."],
      },
      install: {
        title: "Instale a coleção completa",
        summary: "Execute os comandos na raiz do repositório. Escolha a coleção completa, uma skill ou um pacote ativo.",
        complete: "Coleção completa",
        skill: "Uma skill",
        pack: "Um pacote ativo",
        demoLabel: "Demonstração da instalação",
        demoSuccess: "18 skills prontas para usar.",
      },
      verify: {
        title: "Verifique a instalação",
        summary: "Liste o destino e confirme que as pastas selecionadas contêm seus arquivos SKILL.md canônicos.",
        commands: "Comandos de verificação",
      },
      maintenanceLabel: "Manutenção",
      update: {
        title: "Atualize com segurança",
        summary: "Baixe as mudanças mais recentes do repositório e execute novamente o mesmo instalador. Cada skill selecionada é preparada e substituída de forma atômica.",
      },
      remove: {
        title: "Remova de forma intencional",
        summary: "Exclua apenas a pasta da skill desejada em ~/.agents/skills/. Remover um pacote significa remover cada skill instalada por ele; skills compartilhadas ainda podem pertencer a outro pacote.",
      },
      next: {
        eyebrow: "Escolha seu fluxo",
        title: "Comece pelo resultado necessário.",
        summary: "Explore skills individuais para ter controle preciso ou instale um pacote selecionado para um fluxo conectado.",
        skills: "Explorar skills",
        packs: "Ver pacotes",
      },
    },
    builtWithSkills: {
      eyebrow: "Prova na prática",
      title: "Feito com Skills",
      summary: "Decisões reais de produto e resultados verificáveis produzidos ao aplicar os fluxos desta coleção no próprio Agent Skills Studio.",
      casesLabel: "Estudos de caso Feito com Skills",
      skillsApplied: "Skills aplicadas",
      readCase: "Ler estudo de caso",
      back: "Voltar para Feito com Skills",
      caseStudy: "Estudo de caso",
      published: "Publicado em",
      challenge: "O desafio",
      workflowsTitle: "Fluxos por trás do resultado",
      decisions: "Decisões",
      decisionsTitle: "Da orientação à implementação",
      results: "Resultado verificável",
      resultsTitle: "O que foi entregue",
      evidence: "Ver registro de evidência",
    },
    roadmap: {
      eyebrow: "Roteiro público",
      principleLabel: "Como interpretar",
      principle: "O status reflete evidência, não intenção. Uma iniciativa só avança quando propósito, implementação e verificação estão claros o suficiente para a próxima etapa.",
      stages: [
        { id: "proposal", title: "Proposta", description: "Uma direção pública aberta a casos de uso concretos e contribuições da comunidade.", empty: "Nenhuma iniciativa nesta etapa." },
        { id: "research", title: "Pesquisa", description: "O problema, referências, restrições e caminhos viáveis estão sendo investigados.", empty: "Nenhuma iniciativa nesta etapa." },
        { id: "development", title: "Em desenvolvimento", description: "O escopo aprovado está sendo implementado e verificado em entregas focadas.", empty: "Nenhuma iniciativa nesta etapa." },
        { id: "experimental", title: "Experimental", description: "A capacidade funciona, mas seu contrato ou encaixe ainda pode mudar com o uso real.", empty: "Nenhuma iniciativa nesta etapa." },
        { id: "beta", title: "Beta", description: "A capacidade está disponível e versionada enquanto concluímos os critérios de lançamento.", empty: "Nenhuma iniciativa nesta etapa." },
        { id: "stable", title: "Estável", description: "O contrato foi validado, documentado, é instalável e está protegido pelos gates do projeto.", empty: "Nenhuma iniciativa nesta etapa." },
        { id: "deprecated", title: "Descontinuado", description: "A capacidade está sendo retirada com substituição ou caminho de migração documentado.", empty: "Nenhuma iniciativa nesta etapa." },
      ],
      betaItems: [
        { id: "plugin", title: "Plugin Agent Skills Studio", summary: "Plugin exclusivo de skills e manifesto de marketplace com versão sincronizada e validação." },
        { id: "catalog", title: "Catálogo e pacotes", summary: "Metadados bilíngues, geração determinística, coleções ativas e pacotes planejados transparentes." },
        { id: "installers", title: "Instaladores multiplataforma", summary: "Instalação atômica em Bash e PowerShell para coleção, skills individuais e pacotes ativos." },
        { id: "microsite", title: "Microsite bilíngue", summary: "Site de produção para descoberta, instalação, estudos de caso e contexto público do projeto." },
      ],
      stableItem: { title: "Coleção estável de skills", summary: "Todas as skills canônicas publicadas no catálogo estão marcadas como estáveis e disponíveis pelos caminhos de instalação suportados." },
      itemMeta: { plannedPack: "Pacote planejado", stableSkills: "{count} skills estáveis" },
      viewItem: "Ver detalhes",
      contributeLabel: "Caminho comunitário",
      contributeTitle: "Ajude uma proposta a avançar.",
      contributeSummary: "Compartilhe um caso real, cenário de validação ou restrição de implementação nas Issues do GitHub. É a evidência que faz o roadmap avançar.",
      contributeAction: "Abrir Issues no GitHub",
    },
    packDetail: {
      back: "Voltar para pacotes",
      active: "Ativo",
      planned: "Planejado",
      outcomes: "Resultados esperados",
      composition: "Composição do pacote",
      skills: "skills",
      version: "Versão",
      installation: "Instale este pacote",
      installationSummary: "Execute o comando do seu sistema operacional na raiz do repositório.",
      plannedTitle: "Este pacote está no roadmap",
      plannedSummary: "Suas skills serão adicionadas por propostas públicas e validação independente. A instalação ficará disponível apenas quando o pacote estiver ativo.",
      bash: "Bash",
      powershell: "PowerShell",
      copy: "Copiar",
      copied: "Copiado",
      notFoundTitle: "Pacote não encontrado",
      notFoundSummary: "Este pacote não existe na coleção atual ou não está mais disponível.",
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
      switchToLight: "Mudar para tema claro",
      switchToDark: "Mudar para tema escuro",
    },
    footer: {
      summary: "Habilidades abertas para criar agentes úteis.",
      source: "Código-fonte no GitHub",
      contribute: "Contribuir no GitHub",
      version: "Versão {version}",
      navigationLabel: "Navegação do rodapé",
      signature: "Criado por Jhonatan Oliveira",
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
