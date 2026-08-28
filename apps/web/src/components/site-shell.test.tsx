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
    ["en", "Theme", "Switch language to Português (Brasil)", "/pt-BR/skills/example", "pt-BR"],
    ["pt-BR", "Tema", "Mudar idioma para English", "/en/skills/example", "en"],
  ] as const)(
    "keeps the current path and persists the alternate locale from %s",
    (locale, themeLabel, switchLabel, href, storedLocale) => {
      navigation.pathname = `/${locale}/skills/example`;
      const { container } = renderHeader(locale);

      expect(screen.getByRole("combobox", { name: themeLabel })).toBeInTheDocument();
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

describe("foundation home", () => {
  it.each([
    ["en", "Composable skills for capable agents.", "18 skills", "6 packs", "2 locales", "Choose → install → invoke"],
    ["pt-BR", "Habilidades combináveis para agentes capazes.", "18 skills", "6 pacotes", "2 idiomas", "Escolha → instale → invoque"],
  ] as const)("renders catalog-backed localized content for %s", async (locale, title, skills, packs, locales, process) => {
    render(await HomePage({ params: Promise.resolve({ locale }) }));

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText(skills)).toBeInTheDocument();
    expect(screen.getByText(packs)).toBeInTheDocument();
    expect(screen.getByText(locales)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: process })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: locale === "en" ? "Explore skills" : "Explorar skills" })).toHaveAttribute(
      "href",
      `/${locale}/skills`,
    );
    expect(screen.getByText(locale === "en" ? /searchable catalog/i : /catálogo com busca/i)).toBeInTheDocument();
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
    ["roadmap", RoadmapPage, "Roadmap", "Roteiro"],
    ["about", AboutPage, "About", "Sobre"],
  ] as const)("renders a localized static shell for /%s", async (_section, Page, enHeading, ptHeading) => {
    const { unmount } = render(await Page({ params: Promise.resolve({ locale: "en" }) }));
    expect(screen.getByRole("heading", { level: 1, name: enHeading })).toBeInTheDocument();
    expect(screen.getByText("Foundation route", { selector: "p" })).toBeInTheDocument();
    unmount();

    render(await Page({ params: Promise.resolve({ locale: "pt-BR" }) }));
    expect(screen.getByRole("heading", { level: 1, name: ptHeading })).toBeInTheDocument();
    expect(screen.getByText("Base desta rota", { selector: "p" })).toBeInTheDocument();
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
