import type { Locale } from "./locales";

type HomeManifestoCopy = Readonly<{
  eyebrow: string;
  titleLead: string;
  titleClose: string;
  summary: string;
  primaryAction: string;
  secondaryAction: string;
  secondaryHref: string;
  engine: Readonly<{
    label: string;
    promptLabel: string;
    prompt: string;
    stages: readonly [string, string, string];
    resultLabel: string;
    result: string;
  }>;
}>;

export const homeManifesto = {
  en: {
    eyebrow: "Agent Skills Studio / Open collection",
    titleLead: "Skills are not prompts.",
    titleClose: "They are working methods.",
    summary: "Open workflows for agents that need to interpret context, make decisions, and deliver verifiable outcomes.",
    primaryAction: "Explore the collection",
    secondaryAction: "See the method",
    secondaryHref: "/getting-started",
    engine: {
      label: "Method Engine",
      promptLabel: "Natural request",
      prompt: "Create a premium experience to present this collection.",
      stages: ["Context", "Method", "Evidence"],
      resultLabel: "Verified outcome",
      result: "Implemented · responsive · accessible · validated",
    },
  },
  "pt-BR": {
    eyebrow: "Agent Skills Studio / Coleção aberta",
    titleLead: "Skills não são prompts.",
    titleClose: "São métodos de trabalho.",
    summary: "Fluxos abertos para agentes que precisam interpretar contexto, tomar decisões e entregar resultados verificáveis.",
    primaryAction: "Explorar a coleção",
    secondaryAction: "Ver o método",
    secondaryHref: "/getting-started",
    engine: {
      label: "Motor de Método",
      promptLabel: "Pedido em linguagem natural",
      prompt: "Crie uma experiência premium para apresentar esta coleção.",
      stages: ["Contexto", "Método", "Evidência"],
      resultLabel: "Resultado verificável",
      result: "Implementada · responsiva · acessível · validada",
    },
  },
} satisfies Record<Locale, HomeManifestoCopy>;
