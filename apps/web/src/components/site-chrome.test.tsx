import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/en" }));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { ThemeProvider } from "./theme-provider";

function renderHeader(locale: "en" | "pt-BR") {
  navigation.pathname = `/${locale}`;
  return render(
    <ThemeProvider attribute="class">
      <SiteHeader locale={locale} />
    </ThemeProvider>,
  );
}

describe("editorial site chrome", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it.each([
    ["en", "Open navigation", "Built with skills", "Inspect real projects, the skills used, and the evidence left after the work shipped.", "Roadmap", "Release status and individual skill maturity are tracked separately and advance only with evidence."],
    ["pt-BR", "Abrir navegação", "Feito com habilidades", "Inspecione projetos reais, as skills usadas e as evidências que ficaram depois da entrega.", "Roteiro", "O status da release e a maturidade das skills são acompanhados separadamente e só avançam com evidência."],
  ] as const)("turns the %s header into a contextual studio index", async (locale, openLabel, proofLabel, proofContext, roadmapLabel, roadmapContext) => {
    const { container } = renderHeader(locale);

    expect(container.querySelector('[data-site-chrome="publication-bar"]')).toBeInTheDocument();
    expect(screen.getByText("INDEX")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: openLabel }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-navigation-mode", "studio-index");
    expect(dialog).toHaveAttribute("data-viewport-contract", "desktop-100dvh");
    expect(container.querySelector('[data-navigation-transition="header-reveal"]')).toBeInTheDocument();
    expect(within(dialog).getByText("54 SKILLS")).toBeInTheDocument();
    expect(within(dialog).getByText("11 PACKS")).toBeInTheDocument();
    expect(within(dialog).getByText("1.0.0")).toBeInTheDocument();
    expect(dialog.querySelectorAll(".primary-navigation__mobile-context")).toHaveLength(6);

    const proofLink = within(dialog).getByRole("link", { name: proofLabel });
    fireEvent.mouseEnter(proofLink);
    expect(await within(dialog).findByText(proofContext)).toBeInTheDocument();

    const roadmapLink = within(dialog).getByRole("link", { name: roadmapLabel });
    fireEvent.focus(roadmapLink);
    expect(await within(dialog).findByText(roadmapContext)).toBeInTheDocument();
  });

  it.each([
    ["en", "Methods only matter when they change the work.", "Explore", "Project", "Source"],
    ["pt-BR", "Métodos só têm valor quando mudam o trabalho.", "Explorar", "Projeto", "Origem"],
  ] as const)("turns the %s footer into end matter and a colophon", (locale, manifesto, explore, project, source) => {
    const { container } = render(<SiteFooter locale={locale} />);

    const footer = container.querySelector<HTMLElement>('[data-footer-mode="end-matter"]');
    expect(footer).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: manifesto })).toBeInTheDocument();
    expect(screen.getByText(explore)).toBeInTheDocument();
    expect(screen.getByText(project)).toBeInTheDocument();
    expect(screen.getByText(source)).toBeInTheDocument();

    const wordmark = footer?.querySelector<HTMLImageElement>(".site-footer__brand-logo");
    expect(wordmark).toBeInTheDocument();
    expect(wordmark).toHaveAttribute("src", "/brand/agent-skills-logo-horizontal.svg");
    expect(wordmark).toHaveAttribute("alt", "");

    const collection = footer?.querySelector<HTMLElement>(".site-footer__collection");
    expect(collection).toBeInTheDocument();
    expect(within(collection!).getByText(/54 skills/i)).toBeInTheDocument();
    expect(within(collection!).getByText(/11 packs|11 pacotes/i)).toBeInTheDocument();
  });
});