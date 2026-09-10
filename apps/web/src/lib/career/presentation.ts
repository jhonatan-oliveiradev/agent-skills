import type { Locale } from "@/lib/locales";
import { competencyDefinitions, type CompetencyId } from "./competencies";

const portugueseCompetencyLabels: Readonly<Record<CompetencyId, string>> = {
  "programming-javascript": "JavaScript",
  "programming-typescript": "TypeScript e modelagem de tipos",
  "web-platform-foundations": "Fundamentos da plataforma Web",
  "ui-component-modeling": "Modelagem de componentes de UI",
  "state-data-flow": "Estado e fluxo de dados",
  "web-accessibility": "Acessibilidade Web",
  "http-api-engineering": "Engenharia HTTP e APIs",
  "node-runtime-foundations": "Fundamentos de runtime no servidor",
  "relational-data-modeling": "Modelagem de dados relacionais",
  "testing-behavior": "Testes orientados a comportamento",
  "git-collaboration": "Colaboração com controle de versão",
  "application-security-foundations": "Fundamentos de segurança de aplicações",
  "architecture-boundaries": "Fronteiras de arquitetura",
  "professional-evidence": "Evidência profissional",
};

export function getCompetencyLabel(competencyId: string, locale: Locale): string {
  const definition = competencyDefinitions.find((candidate) => candidate.id === competencyId);
  if (!definition) return competencyId;

  return locale === "pt-BR" ? portugueseCompetencyLabels[definition.id] : definition.title;
}
