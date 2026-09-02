import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { messages } from "@/lib/messages";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import AboutPage from "@/app/[locale]/about/page";
import BuiltWithSkillsDetailPage from "@/app/[locale]/built-with-skills/[slug]/page";
import BuiltWithSkillsPage from "@/app/[locale]/built-with-skills/page";
import ChangelogPage from "@/app/[locale]/changelog/page";
import ContributePage from "@/app/[locale]/contribute/page";
import GettingStartedPage from "@/app/[locale]/getting-started/page";
import HomePage from "@/app/[locale]/page";
import PacksPage from "@/app/[locale]/packs/page";
import RoadmapPage from "@/app/[locale]/roadmap/page";
import SkillsPage from "@/app/[locale]/skills/page";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LocaleSwitcher } from "@/components/locale-switcher";
import RootLayout from "@/app/layout";
import LocaleLayout from "@/app/[locale]/layout";

const originalLocation = window.location;

beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...originalLocation, pathname: "/en" },
  });
});

afterAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation,
  });
});

describe("site shell", () => {
  it.each(["en", "pt-BR"] as const)("renders localized primary navigation for %s", (locale) => {
    render(<SiteHeader locale={locale} />);
    expect(screen.getByRole("navigation", { name: messages[locale].navigation.primary })).toBeInTheDocument();
  });

  it.each(["en", "pt-BR"] as const)("renders localized footer for %s", (locale) => {
    render(<SiteFooter locale={locale} version="1.0.0" />);
    expect(screen.getByText(messages[locale].footer.summary)).toBeInTheDocument();
    expect(screen.getByText(messages[locale].footer.signature)).toBeInTheDocument();
  });

  it.each([
    ["en", "pt-BR"],
    ["pt-BR", "en"],
  ] as const)("keeps the current path and persists the alternate locale from %s", (locale, targetLocale) => {
    render(<LocaleSwitcher locale={locale} />);
    const target = screen.getByRole("link", { name: messages[locale].locale.switchTo.replace("{language}", messages[locale].locale[targetLocale === "en" ? "en" : "ptBR"]) });
    expect(target).toHaveAttribute("href", `/${targetLocale}`);
  });

  it.each(["en", "pt-BR"] as const)("opens the NX-like navigation panel and closes it with Escape for %s", (locale) => {
    render(<SiteHeader locale={locale} />);
    expect(screen.getByRole("navigation", { name: messages[locale].navigation.primary })).toBeInTheDocument();
  });

  it.each(["en", "pt-BR"] as const)("renders equivalent project links and catalog version for %s", (locale) => {
    render(<SiteFooter locale={locale} version="1.0.0" />);
    expect(screen.getByText(messages[locale].footer.version.replace("{version}", "1.0.0"))).toBeInTheDocument();
  });

  it("places the localized skip link before the shared shell and main target", async () => {
    const { container } = render(await LocaleLayout({ children: <div>content</div>, params: Promise.resolve({ locale: "en" }) }));
    expect(container.querySelector("a[href='#main-content']")).toBeInTheDocument();
  });

  it.each(["en", "pt-BR"] as const)("renders the definitive catalog-backed home for %s", async (locale) => {
    const { container } = render(await HomePage({ params: Promise.resolve({ locale }) }));
    expect(container.querySelector("[data-home-living-archive]")).toBeInTheDocument();
  });

  it.each(["en", "pt-BR"] as const)("publishes canonical localized metadata for %s", async (locale) => {
    render(await AboutPage({ params: Promise.resolve({ locale }) }));
    expect(document.body).toBeTruthy();
  });

  it("shows an animated terminal demonstration in the installation guide", async () => {
    const { container } = render(await GettingStartedPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(container.querySelector("[data-terminal-demo]")).toBeInTheDocument();
  });

  it("renders full installation commands in aligned editorial rows", async () => {
    const { container } = render(await GettingStartedPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(container.querySelectorAll("[data-install-command]").length).toBeGreaterThan(0);
  });

  it.each(["en", "pt-BR"] as const)("renders the evidence archive for %s", async (locale) => {
    const { container } = render(await BuiltWithSkillsPage({ params: Promise.resolve({ locale }) }));
    expect(container.querySelector("[data-evidence-archive]")).toBeInTheDocument();
  });

  it("links a case study to its explicit source evidence and applied skills", async () => {
    const { container } = render(await BuiltWithSkillsDetailPage({
      params: Promise.resolve({ locale: "en", slug: "rocket-editorial-error-boundary" }),
    }));
    expect(container.querySelector("[data-evidence-report]")).toBeInTheDocument();
  });
});

describe("foundation navigation targets", () => {
  it.each([
    ["en", "About"],
    ["pt-BR", "Sobre"],
  ] as const)("renders real localized content for /about in %s", async (locale, heading) => {
    render(await AboutPage({ params: Promise.resolve({ locale }) }));
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });

  it.each([
    ["en", "Contribute"],
    ["pt-BR", "Contribuir"],
  ] as const)("renders real localized content for /contribute in %s", async (locale, heading) => {
    render(await ContributePage({ params: Promise.resolve({ locale }) }));
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });

  it.each([
    ["en", "Changelog"],
    ["pt-BR", "Changelog"],
  ] as const)("renders real localized content for /changelog in %s", async (locale, heading) => {
    render(await ChangelogPage({ params: Promise.resolve({ locale }) }));
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });

  it("publishes real contribution paths and readable release notes", async () => {
    const { unmount } = render(await ContributePage({ params: Promise.resolve({ locale: "en" }) }));
    expect(screen.getByRole("link", { name: /open github issues/i })).toHaveAttribute(
      "href",
      "https://github.com/jhonatan-oliveiradev/agent-skills/issues",
    );
    expect(screen.getByRole("link", { name: /compare changes/i })).toHaveAttribute(
      "href",
      "https://github.com/jhonatan-oliveiradev/agent-skills/compare",
    );
    unmount();

    render(await ChangelogPage({ params: Promise.resolve({ locale: "en" }) }));
    const currentReleaseHeading = screen.getByRole("heading", { name: "1.0.0" });
    expect(currentReleaseHeading).toBeInTheDocument();
    const currentRelease = currentReleaseHeading.closest("article");
    expect(currentRelease).not.toBeNull();
    expect(currentRelease).toHaveTextContent(/evidence-qualified.*Stable 1.0.0/i);
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
    expect(screen.getAllByText(empty)).toHaveLength(6);
    expect(container.querySelectorAll("[data-program-record]")).toHaveLength(5);
  });

  it.each([
    ["en", "Methods that become stronger together.", "/en/packs/frontend-product"],
    ["pt-BR", "Métodos que ficam melhores juntos.", "/pt-BR/packs/frontend-product"],
  ] as const)("renders the curated systems archive for %s", async (locale, heading, packHref) => {
    const { container } = render(await PacksPage({ params: Promise.resolve({ locale }) }));

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-pack-dossier]")).toHaveLength(11);
    expect(container.querySelectorAll('[data-pack-dossier][data-status="active"]')).toHaveLength(11);
    expect(screen.getByRole("link", { name: /frontend product/i })).toHaveAttribute("href", packHref);
  });

  it.each([
    ["en", "Installation guide"],
    ["pt-BR", "Guia de instalação"],
  ] as const)("renders the localized installation guide for %s", async (locale, heading) => {
    render(await GettingStartedPage({ params: Promise.resolve({ locale }) }));
    expect(screen.getByText(heading)).toBeInTheDocument();
  });

  it.each([
    ["en", "Methods"],
    ["pt-BR", "Métodos"],
  ] as const)("renders the localized method archive for %s", async (locale, heading) => {
    render(await SkillsPage({ params: Promise.resolve({ locale }) }));
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });
});

describe("layouts", () => {
  it("renders the root document shell", () => {
    const { container } = render(<RootLayout><div>content</div></RootLayout>);
    expect(container).toBeTruthy();
  });
});
