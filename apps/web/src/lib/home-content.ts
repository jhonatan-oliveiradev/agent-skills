import type { Locale } from "./locales";

export const homeManifesto = {
  en: {
    eyebrow: "Agent Skills Studio / Open collection",
    titleLead: "Skills are not prompts.",
    titleClose: "They are working methods.",
    summary: "Open workflows for agents that need to interpret context, make decisions, and deliver verifiable outcomes.",
    primaryAction: "Explore the collection",
    secondaryAction: "See the method",
    secondaryHref: "/getting-started",
    visualLabel: "Procedural field representing connected working methods",
    index: "Manifesto 01 / 06",
  },
  "pt-BR": {
    eyebrow: "Agent Skills Studio / Coleção aberta",
    titleLead: "Skills não são prompts.",
    titleClose: "São métodos de trabalho.",
    summary: "Fluxos abertos para agentes que precisam interpretar contexto, tomar decisões e entregar resultados verificáveis.",
    primaryAction: "Explorar a coleção",
    secondaryAction: "Ver o método",
    secondaryHref: "/getting-started",
    visualLabel: "Campo procedural representando métodos de trabalho conectados",
    index: "Manifesto 01 / 06",
  },
} satisfies Record<Locale, Record<string, string>>;
