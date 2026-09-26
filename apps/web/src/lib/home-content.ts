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
    eyebrow: "AGENT SKILLS STUDIO / METHODS FOR MAKING",
    titleLead: "Give your agent",
    titleClose: "a better way to work.",
    summary:
      "From the first idea to the finished result. Install methods that help your agent think through the work, make deliberate choices, and deliver with evidence.",
    primaryAction: "Explore skills",
    secondaryAction: "Inspect real-use evidence",
    secondaryHref: "/built-with-skills",
    engine: {
      label: "Method Engine",
      promptLabel: "Natural request",
      prompt: "Audit this interface, improve the hierarchy, and verify the result.",
      stages: ["Request", "Method", "Evidence"],
      resultLabel: "Verified outcome",
      result: "Implemented · responsive · accessible · validated",
    },
  },
  "pt-BR": {
    eyebrow: "AGENT SKILLS STUDIO / MÉTODOS PARA CRIAR",
    titleLead: "Dê ao seu agente",
    titleClose: "um jeito melhor de trabalhar.",
    summary:
      "Da primeira ideia ao resultado final. Instale métodos que ajudam seu agente a entender o trabalho, tomar decisões e entregar com evidências.",
    primaryAction: "Explorar skills",
    secondaryAction: "Inspecionar evidências reais",
    secondaryHref: "/built-with-skills",
    engine: {
      label: "Motor de Método",
      promptLabel: "Pedido em linguagem natural",
      prompt: "Audite esta interface, melhore a hierarquia e verifique o resultado.",
      stages: ["Pedido", "Método", "Evidência"],
      resultLabel: "Resultado verificável",
      result: "Implementada · responsiva · acessível · validada",
    },
  },
} satisfies Record<Locale, HomeManifestoCopy>;
