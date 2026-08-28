import type { Locale } from "./locales";

export interface Messages {
  readonly skipLink: string;
  readonly brandLabel: string;
  readonly navigation: {
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
  readonly catalog: {
    readonly skillsCount: string;
    readonly packsCount: string;
  };
  readonly locale: {
    readonly label: string;
    readonly en: string;
    readonly ptBR: string;
  };
  readonly theme: {
    readonly label: string;
    readonly light: string;
    readonly dark: string;
    readonly system: string;
  };
  readonly footer: {
    readonly summary: string;
    readonly github: string;
    readonly license: string;
  };
}

export const messages = {
  en: {
    skipLink: "Skip to content",
    brandLabel: "Agent Skills Studio",
    navigation: {
      skills: "Skills",
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
    catalog: {
      skillsCount: "skills",
      packsCount: "packs",
    },
    locale: {
      label: "Language",
      en: "English",
      ptBR: "Portugu\u00eas (Brasil)",
    },
    theme: {
      label: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    footer: {
      summary: "Open skills for building useful agents.",
      github: "GitHub",
      license: "MIT License",
    },
  },
  "pt-BR": {
    skipLink: "Pular para o conte\u00fado",
    brandLabel: "Agent Skills Studio",
    navigation: {
      skills: "Habilidades",
      packs: "Pacotes",
      gettingStarted: "Primeiros passos",
      builtWithSkills: "Feito com habilidades",
      roadmap: "Roteiro",
      about: "Sobre",
      contribute: "Contribuir",
      changelog: "Registro de altera\u00e7\u00f5es",
    },
    hero: {
      eyebrow: "Agent Skills Studio",
      title: "Habilidades combin\u00e1veis para agentes capazes.",
      summary: "Explore habilidades e pacotes prontos para produzir agentes melhores.",
      primaryAction: "Explorar habilidades",
      secondaryAction: "Ver pacotes",
    },
    catalog: {
      skillsCount: "habilidades",
      packsCount: "pacotes",
    },
    locale: {
      label: "Idioma",
      en: "English",
      ptBR: "Portugu\u00eas (Brasil)",
    },
    theme: {
      label: "Tema",
      light: "Claro",
      dark: "Escuro",
      system: "Sistema",
    },
    footer: {
      summary: "Habilidades abertas para criar agentes \u00fateis.",
      github: "GitHub",
      license: "Licen\u00e7a MIT",
    },
  },
} satisfies Record<Locale, Messages>;
