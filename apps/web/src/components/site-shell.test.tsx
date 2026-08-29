import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

const navigation = vi.hoisted(() => ({ pathname: "/en/skills/example" }));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
  usePathname: () => navigation.pathname,
}));

import AboutPage from "@/app/[locale]/about/page";
import ChangelogPage from "@/app/[locale]/changelog/page";
import ContributePage from "@/app/[locale]/contribute/page";
import BuiltWithSkillsPage from "@/app/[locale]/built-with-skills/page";
import BuiltWithSkillsDetailPage from "@/app/[locale]/built-with-skills/[slug]/page";
import GettingStartedPage from "@/app/[locale]/getting-started/page";
import LocaleLayout from "@/app/[locale]/layout";
import HomePage, { generateMetadata } from "@/app/[locale]/page";
import PacksPage from "@/app/[locale]/packs/page";
import RoadmapPage from "@/app/[locale]/roadmap/page";
import SkillsPage from "@/app/[locale]/skills/page";
import { ThemeProvider } from "./theme-provider";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

function renderHeader(locale: "en" | "pt-BR") {
  return render(
    <ThemeProvider attribute="class">
      <SiteHeader locale={locale} />
    </ThemeProvider>,
  );
}

describe("SiteHeader", () => {
  beforeEach(() => {
    window.localStorage.clear();
    navigation.pathname = "/en/skills/example";
  });

  it.each([
    ["en", "Explore skills", "/en/skills", "Primary navigation"],
    ["pt-BR", "Explorar skills", "/pt-BR/skills", "Navegação principal"],
  ] as const)("renders localized primary navigation for %s", (locale, label, href, navLabel) => {
    renderHeader(locale);

    const navigationRegion = screen.getByRole("navigation", { name: navLabel });
    expect(within(navigationRegion).getByRole("link", { name: label })).toHaveAttribute(
      "href",
      href,
    );
    expect(screen.getByRole("link", { name: /Agent Skills Studio/i })).toHaveAttribute(
      "href",
      `/${locale}`,
    );

    const header = screen.getByRole("banner");
    const hrefs = within(header)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it.each([
    ["en", "Switch to dark theme", "Switch language to Português (Brasil)", "/pt-BR/skills/example", "pt-BR"],
    ["pt-BR", "Mudar para tema escuro", "Mudar idioma para English", "/en/skills/example", "en"],
  ] as const)(
    "keeps the current path and persists the alternate locale from %s",
    (locale, themeLabel, switchLabel, href, storedLocale) => {
      navigation.pathname = `/${locale}/skills/example`;
      const { container } = renderHeader(locale);

      expect(screen.getByRole("button", { name: themeLabel })).toBeInTheDocument();
      const localeLink = screen.getByRole("link", { name: switchLabel });
      expect(localeLink).toHaveTextContent(storedLocale === "en" ? "EN" : "PT-BR");
      expect(localeLink).toHaveAttribute("href", href);

      localeLink.addEventListener("click", (event) => event.preventDefault());
      fireEvent.click(localeLink);
      expect(window.localStorage.getItem("agent-skills-locale")).toBe(storedLocale);
      expect(
        container.querySelector("a button, a select, button a, select a"),
      ).not.toBeInTheDocument();
    },
  );
});

describe("SiteFooter", () => {
  it.each([
    ["en", "Source on GitHub", "Contribute on GitHub", "Version 1.0.0-beta.1"],
    ["pt-BR", "Código-fonte no GitHub", "Contribuir no GitHub", "Versão 1.0.0-beta.1"],
  ] as const)("renders equivalent project links and catalog version for %s", (locale, source, contribute, version) => {
    render(<SiteFooter locale={locale} />);

    expect(screen.getByRole("link", { name: source })).toHaveAttribute(
      "href",
      "https://github.com/jhonatan-oliveiradev/agent-skills",
    );
    expect(screen.getByRole("link", { name: contribute })).toHaveAttribute(
      "rel",
      "noreferrer noopener",
    );
    expect(screen.getByText(version)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: locale === "en" ? "Footer navigation" : "Navegação do rodapé" })).toBeInTheDocument();
  });
});

describe("localized layout", () => {
  it("places the localized skip link before the shared shell and main target", async () => {
    const markup = renderToStaticMarkup(
      await LocaleLayout({
        children: <p>Page content</p>,
        params: Promise.resolve({ locale: "pt-BR" }),
      }),
    );

    expect(markup).toContain('<html lang="pt-BR"');
    expect(markup).toContain('href="#main-content"');
    expect(markup).toContain('<main id="main-content"');
    expect(markup.indexOf('href="#main-content"')).toBeLessThan(markup.indexOf("<header"));
    expect(markup.indexOf("<header")).toBeLessThan(markup.indexOf('<main id="main-content"'));
  });
});

describe("definitive home", () => {
  it.each([
    ["en", "Composable skills for capable agents.", "18 skills", "6 packs", "2 locales", "Choose the right starting point", "Proof, not promises."],
    ["pt-BR", "Habilidades combináveis para agentes capazes.", "18 skills", "6 pacotes", "2 idiomas", "Escolha o ponto de partida", "Evidência, não promessas."],
  ] as const)("renders the definitive catalog-backed home for %s", async (locale, title, skills, packs, locales, startingPoint, proof) => {
    const { container } = render(await HomePage({ params: Promise.resolve({ locale }) }));

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText(skills)).toBeInTheDocument();
    expect(screen.getByText(packs)).toBeInTheDocument();
    expect(screen.getByText(locales)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: startingPoint })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: proof })).toBeInTheDocument();
    expect(container.querySelectorAll(".home-pack-card")).toHaveLength(3);
    expect(container.querySelectorAll(".home-case-card")).toHaveLength(2);
    expect(screen.getByRole("link", { name: locale === "en" ? "Explore skills" : "Explorar skills" })).toHaveAttribute(
      "href",
      `/${locale}/skills`,
    );
    expect(screen.getByRole("link", { name: locale === "en" ? "Read the roadmap" : "Ver o roteiro" })).toHaveAttribute("href", `/${locale}/roadmap`);
    expect(screen.queryByText(locale === "en" ? /foundation delivery/i : /entrega de fundação/i)).not.toBeInTheDocument();
  });

  it.each([
    ["en", "Composable agent skills", "Build capable agents with production-ready, composable workflows.", "/en"],
    ["pt-BR", "Skills combináveis para agentes", "Crie agentes capazes com fluxos combináveis e prontos para produção.", "/pt-BR"],
  ] as const)("publishes canonical localized metadata for %s", async (locale, title, description, canonical) => {
    await expect(generateMetadata({ params: Promise.resolve({ locale }) })).resolves.toMatchObject({
      title,
      description,
      alternates: {
        canonical,
        languages: {
          en: "/en",
          "pt-BR": "/pt-BR",
          "x-default": "/en",
        },
      },
    });
  });
});

describe("foundation navigation targets", () => {
  it.each([
    ["en", "Built with Skills", "Catalog experience", "Pack experience"],
    ["pt-BR", "Feito com Skills", "Experiência do catálogo", "Experiência dos pacotes"],
  ] as const)("renders real built-with-skills cases for %s", async (locale, heading, catalog, packs) => {
    const { container } = render(
      await BuiltWithSkillsPage({ params: Promise.resolve({ locale }) }),
    );

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: catalog })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: packs })).toBeInTheDocument();
    expect(container.querySelectorAll(".built-case-card")).toHaveLength(2);
  });

  it("links a case study to its evidence record and applied skills", async () => {
    render(
      await BuiltWithSkillsDetailPage({
        params: Promise.resolve({ locale: "en", slug: "catalog-experience" }),
      }),
    );

    expect(screen.getByRole("link", { name: "View evidence record" })).toHaveAttribute(
      "href",
      expect.stringContaining("docs/built-with-skills/2026-08-28-catalog-experience.md"),
    );
    expect(screen.getByRole("link", { name: "Designing UI Systems" })).toHaveAttribute(
      "href",
      "/en/skills/designing-ui-systems",
    );
  });

  it.each([
    ["about", AboutPage, "About the studio", "Sobre o studio"],
    ["contribute", ContributePage, "Build the collection with us", "Construa a coleção com a gente"],
    ["changelog", ChangelogPage, "Changelog", "Histórico de mudanças"],
  ] as const)("renders real localized content for /%s", async (_section, Page, enHeading, ptHeading) => {
    const { unmount } = render(await Page({ params: Promise.resolve({ locale: "en" }) }));
    expect(screen.getByRole("heading", { level: 1, name: enHeading })).toBeInTheDocument();
    unmount();

    render(await Page({ params: Promise.resolve({ locale: "pt-BR" }) }));
    expect(screen.getByRole("heading", { level: 1, name: ptHeading })).toBeInTheDocument();
  });

  it("publishes real contribution paths and readable release notes", async () => {
    const { unmount } = render(await ContributePage({ params: Promise.resolve({ locale: "en" }) }));
    expect(screen.getByRole("link", { name: /open an issue/i })).toHaveAttribute(
      "href",
      "https://github.com/jhonatan-oliveiradev/agent-skills/issues/new",
    );
    expect(screen.getByRole("link", { name: /open a pull request/i })).toHaveAttribute(
      "href",
      "https://github.com/jhonatan-oliveiradev/agent-skills/compare",
    );
    unmount();

    render(await ChangelogPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(screen.getByRole("heading", { name: "1.0.0-beta.1" })).toBeInTheDocument();
    expect(screen.getByText(/searchable.*catalog/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /source changelog/i })).toHaveAttribute(
      "href",
      expect.stringContaining("CHANGELOG.md"),
    );
  });

  it.each([
    ["en", "Roadmap", "Proposal", "Stable", "No initiatives in this stage."],
    ["pt-BR", "Roteiro", "Proposta", "Estável", "Nenhuma iniciativa nesta etapa."],
  ] as const)("renders the evidence-backed roadmap for %s", async (locale, heading, proposal, stable, empty) => {
    const { container } = render(await RoadmapPage({ params: Promise.resolve({ locale }) }));

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: proposal })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: stable })).toBeInTheDocument();
    expect(screen.getAllByText(empty)).toHaveLength(4);
    expect(container.querySelectorAll(".roadmap-item")).toHaveLength(8);
  });

  it.each([
    ["en", "Packs", "Active", "Planned"],
    ["pt-BR", "Pacotes", "Ativo", "Planejado"],
  ] as const)("renders active and planned packs for %s", async (locale, heading, active, planned) => {
    const { container } = render(await PacksPage({ params: Promise.resolve({ locale }) }));

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(container.querySelectorAll(".pack-card")).toHaveLength(6);
    expect(screen.getAllByText(active)).toHaveLength(3);
    expect(screen.getAllByText(planned)).toHaveLength(3);
    expect(
      screen.getAllByText(
        locale === "en" ? "Composition in progress" : "Composição em definição",
      ),
    ).toHaveLength(3);
  });

  it.each([
    ["en", "Getting started", "Install the complete collection", "Verify the installation"],
    ["pt-BR", "Primeiros passos", "Instale a coleção completa", "Verifique a instalação"],
  ] as const)("renders the localized installation guide for %s", async (locale, heading, fullInstall, verify) => {
    render(await GettingStartedPage({ params: Promise.resolve({ locale }) }));

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: fullInstall })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: verify })).toBeInTheDocument();
    expect(screen.getByText("bash install.sh")).toBeInTheDocument();
    expect(screen.getByText("./install.ps1")).toBeInTheDocument();
    expect(screen.getByText("./install.sh --skill craft-premium-motion")).toBeInTheDocument();
    expect(screen.getByText("./install.sh --pack motion")).toBeInTheDocument();
  });

  it.each([
    ["en", "Skills", "18 skills found"],
    ["pt-BR", "Habilidades", "18 skills encontradas"],
  ] as const)("renders the localized skills catalog for %s", async (locale, heading, count) => {
    const { container } = render(
      <NuqsTestingAdapter>
        {await SkillsPage({ params: Promise.resolve({ locale }) })}
      </NuqsTestingAdapter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByText(count)).toBeInTheDocument();
    expect(container.querySelectorAll(".skill-card")).toHaveLength(18);
  });
});
