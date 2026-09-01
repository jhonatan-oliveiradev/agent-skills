import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { builtWithSkills } from "@/lib/built-with-skills";
import { messages } from "@/lib/messages";
import AboutPage from "@/app/[locale]/about/page";
import BuiltWithSkillsPage from "@/app/[locale]/built-with-skills/page";
import BuiltWithSkillsDetailPage from "@/app/[locale]/built-with-skills/[slug]/page";
import ChangelogPage from "@/app/[locale]/changelog/page";
import ContributePage from "@/app/[locale]/contribute/page";
import GettingStartedPage, {
  generateMetadata as generateGettingStartedMetadata,
} from "@/app/[locale]/getting-started/page";
import HomePage, { generateMetadata as generateHomeMetadata } from "@/app/[locale]/page";
import PacksPage from "@/app/[locale]/packs/page";
import RoadmapPage from "@/app/[locale]/roadmap/page";
import SkillsPage from "@/app/[locale]/skills/page";
import LocaleLayout from "@/app/[locale]/layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  usePathname: () => "/en/skills",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("server-only", () => ({}));

beforeEach(() => {
  window.localStorage.clear();
});

describe("site shell", () => {
  it.each([
    ["en", "Methods", "Systems", "Evidence", "Field manual"],
    ["pt-BR", "Métodos", "Sistemas", "Evidências", "Manual de campo"],
  ] as const)("renders localized primary navigation for %s", (locale, methods, systems, evidence, manual) => {
    render(<SiteHeader locale={locale} />);

    expect(screen.getByRole("link", { name: methods })).toHaveAttribute("href", `/${locale}/skills`);
    expect(screen.getByRole("link", { name: systems })).toHaveAttribute("href", `/${locale}/packs`);
    expect(screen.getByRole("link", { name: evidence })).toHaveAttribute("href", `/${locale}/built-with-skills`);
    expect(screen.getByRole("link", { name: manual })).toHaveAttribute("href", `/${locale}/getting-started`);
  });

  it.each([
    ["en", "/en/skills", "PT-BR", "/pt-BR/skills"],
    ["pt-BR", "/pt-BR/skills", "EN", "/en/skills"],
  ] as const)("keeps the current path and persists the alternate locale from %s", async (locale, _pathname, alternateLabel, alternateHref) => {
    render(<SiteHeader locale={locale} />);

    const localeButton = screen.getByRole("button", { name: /language|idioma/i });
    fireEvent.click(localeButton);
    expect(await screen.findByRole("link", { name: alternateLabel })).toHaveAttribute("href", alternateHref);
  });

  it("opens the NX-like navigation panel and closes it with Escape", async () => {
    render(<SiteHeader locale="en" />);

    const trigger = screen.getByRole("button", { name: /open navigation/i });
    fireEvent.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it.each(["en", "pt-BR"] as const)("renders equivalent project links and catalog version for %s", (locale) => {
    const { container } = render(<SiteFooter locale={locale} />);
    expect(container.querySelector('[href*="github.com/jhonatan-oliveiradev/agent-skills"]')).toBeInTheDocument();
    expect(container.textContent).toContain("1.0.0-beta.1");
  });

  it("places the localized skip link before the shared shell and main target", async () => {
    const { container } = render(
      await LocaleLayout({ children: <div>Content</div>, params: Promise.resolve({ locale: "en" }) }),
    );
    const skip = screen.getByRole("link", { name: messages.en.skipLink });
    const main = container.querySelector("#main-content");
    expect(skip).toHaveAttribute("href", "#main-content");
    expect(main).toBeInTheDocument();
  });

  it.each(["en", "pt-BR"] as const)("renders the definitive catalog-backed home for %s", async (locale) => {
    const { container } = render(await HomePage({ params: Promise.resolve({ locale }) }));
    expect(container.querySelector("[data-home-living-archive]")).toBeInTheDocument();
  });

  it.each(["en", "pt-BR"] as const)("publishes canonical localized metadata for %s", async (locale) => {
    const metadata = await generateHomeMetadata({ params: Promise.resolve({ locale }) });
    expect(metadata.alternates?.canonical).toBe(`/${locale}`);
  });

  it.each(["en", "pt-BR"] as const)("publishes installation metadata for %s", async (locale) => {
    const metadata = await generateGettingStartedMetadata({ params: Promise.resolve({ locale }) });
    expect(metadata.alternates?.canonical).toBe(`/${locale}/getting-started`);
  });

  it("shows an animated terminal demonstration in the installation guide", async () => {
    const { container } = render(await GettingStartedPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(container.querySelector("[data-terminal-demo]")).toBeInTheDocument();
  });

  it("renders full installation commands in aligned editorial rows", async () => {
    const { container } = render(await GettingStartedPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(container.querySelectorAll(".installation-command-row")).toHaveLength(4);
  });

  it.each(["en", "pt-BR"] as const)("renders the evidence archive for %s", async (locale) => {
    const { container } = render(await BuiltWithSkillsPage({ params: Promise.resolve({ locale }) }));
    expect(container.querySelector("[data-evidence-archive]")).toBeInTheDocument();
  });

  it("links a case study to its explicit source evidence and applied skills", async () => {
    const item = builtWithSkills[0];
    const { container } = render(
      await BuiltWithSkillsDetailPage({ params: Promise.resolve({ locale: "en", slug: item.slug }) }),
    );
    expect(container.querySelector('[data-evidence-report]')).toBeInTheDocument();
    expect(container.querySelector('[data-evidence-source-link]')).toBeInTheDocument();
  });

  it.each([
    [AboutPage, "/about"],
    [ContributePage, "/contribute"],
    [ChangelogPage, "/changelog"],
  ] as const)("renders real localized content for %s", async (Page, route) => {
    const { container } = render(await Page({ params: Promise.resolve({ locale: "en" }) }));
    expect(container.textContent).not.toMatch(/placeholder|coming soon/i);
    expect(route).toMatch(/^\//);
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
    expect(container.querySelectorAll("[data-program-record]")).toHaveLength(8);
  });

  it.each([
    ["en", "Methods that become stronger together.", "/en/packs/frontend-product"],
    ["pt-BR", "Métodos que ficam melhores juntos.", "/pt-BR/packs/frontend-product"],
  ] as const)("renders the curated systems archive for %s", async (locale, heading, packHref) => {
    const { container } = render(await PacksPage({ params: Promise.resolve({ locale }) }));
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-pack-dossier]")).toHaveLength(6);
    expect(container.querySelector(`a[href="${packHref}"]`)).toBeInTheDocument();
  });

  it.each(["en", "pt-BR"] as const)("renders the localized installation guide for %s", async (locale) => {
    const { container } = render(await GettingStartedPage({ params: Promise.resolve({ locale }) }));
    expect(container.querySelector("[data-field-manual]")).toBeInTheDocument();
  });

  it.each(["en", "pt-BR"] as const)("renders the localized method archive for %s", async (locale) => {
    const { container } = render(await SkillsPage({ params: Promise.resolve({ locale }) }));
    expect(container.querySelector("[data-method-archive]")).toBeInTheDocument();
  });
});
