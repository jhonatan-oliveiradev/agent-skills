import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import SkillDetailPage from "@/app/[locale]/skills/[slug]/page";

describe("Codebase Intelligence method route integration", () => {
  it.each([
    {
      locale: "en",
      slug: "mapping-existing-codebase-structure",
      displayName: "Mapping Existing Codebase Structure",
      whenToUse:
        "Use when you need to understand how an existing codebase is organized, where execution enters, how modules divide responsibility, or which ownership boundaries are observable before another engineering decision.",
      whenNotToUse:
        "Do not use to choose a future architecture or design new boundaries; Architecture & Engineering owns those decisions through choosing-application-architecture and designing-software-boundaries.",
      installCommand: "./install.sh --skill mapping-existing-codebase-structure",
    },
    {
      locale: "pt-BR",
      slug: "mapping-existing-codebase-structure",
      displayName: "Mapeamento de Estrutura de Codebase Existente",
      whenToUse:
        "Use quando precisar compreender como uma codebase existente está organizada, onde a execução começa, como os módulos dividem responsabilidades ou quais limites de ownership são observáveis antes de outra decisão de engenharia.",
      whenNotToUse:
        "Não use para escolher uma arquitetura futura ou desenhar novos limites; Arquitetura e Engenharia é responsável por essas decisões com choosing-application-architecture e designing-software-boundaries.",
      installCommand: "./install.sh --skill mapping-existing-codebase-structure",
    },
    {
      locale: "en",
      slug: "planning-codebase-changes-with-evidence",
      displayName: "Planning Codebase Changes with Evidence",
      whenToUse:
        "Use when a real codebase change needs a compact evidence brief that separates current-state facts, inferences, unresolved questions, affected surfaces, and possible implementation slices for the next owner.",
      whenNotToUse:
        "Do not use to produce or execute the implementation plan; Engineering Workflow owns executable planning through planning-engineering-work, while implementation methods own code changes.",
      installCommand: "./install.sh --skill planning-codebase-changes-with-evidence",
    },
    {
      locale: "pt-BR",
      slug: "planning-codebase-changes-with-evidence",
      displayName: "Planejamento de Mudanças em Codebase com Evidências",
      whenToUse:
        "Use quando uma mudança real na codebase precisar de um briefing compacto de evidências que separe fatos do estado atual, inferências, questões não resolvidas, superfícies afetadas e possíveis fatias de implementação para o próximo owner.",
      whenNotToUse:
        "Não use para produzir ou executar o plano de implementação; Engineering Workflow é responsável pelo planejamento executável com planning-engineering-work, enquanto métodos de implementação são responsáveis pelas mudanças de código.",
      installCommand: "./install.sh --skill planning-codebase-changes-with-evidence",
    },
  ] as const)("renders $slug canonical metadata in $locale", async (entry) => {
    const { container, unmount } = render(
      await SkillDetailPage({
        params: Promise.resolve({ locale: entry.locale, slug: entry.slug }),
      }),
    );

    expect(screen.getByRole("heading", { level: 1, name: entry.displayName })).toBeInTheDocument();
    expect(container).toHaveTextContent(entry.whenToUse);
    expect(container).toHaveTextContent(entry.whenNotToUse);
    expect(container).toHaveTextContent(entry.installCommand);
    unmount();
  });
});
