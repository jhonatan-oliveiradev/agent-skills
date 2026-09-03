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
    summary:
      "A curated, installable collection of working methods that gives agents a clearer way to investigate, decide, build, and verify real work.",
    primaryAction: "Explore skills",
    secondaryAction: "Inspect real-use evidence",
    secondaryHref: "/built-with-skills",
    engine: {
      label: "Method Engine",
      promptLabel: "Natural request",
      prompt: "Audit this interface, improve the hierarchy, and verify the result.",
      stages: ["Context", "Method", "Evidence"],
      resultLabel: "Verified outcome",
      result: "Implemented · responsive · accessible · validated",
    },
  },
  "pt-BR": {
    eyebrow: "Agent Skills Studio / Coleção aberta",
    titleLead: "Skills não são prompts.",
    titleClose: "São métodos de trabalho.",
    summary:
      "Uma coleção curada e instalável de métodos de trabalho que dá aos agentes um caminho mais claro para investigar, decidir, construir e verificar trabalho real.",
    primaryAction: "Explorar skills",
    secondaryAction: "Inspecionar evidências reais",
    secondaryHref: "/built-with-skills",
    engine: {
      label: "Motor de Método",
      promptLabel: "Pedido em linguagem natural",
      prompt: "Audite esta interface, melhore a hierarquia e verifique o resultado.",
      stages: ["Contexto", "Método", "Evidência"],
      resultLabel: "Resultado verificável",
      result: "Implementada · responsiva · acessível · validada",
    },
  },
} satisfies Record<Locale, HomeManifestoCopy>;
