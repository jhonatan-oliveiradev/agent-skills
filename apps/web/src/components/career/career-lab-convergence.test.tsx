import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/en" }));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  notFound: () => {
    throw new Error("not found");
  },
}));

import { generateMetadata as generateCareerLabMetadata } from "@/app/[locale]/career-lab/layout";
import PackDetailPage from "@/app/[locale]/packs/[slug]/page";
import sitemap from "@/app/sitemap";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import { messages } from "@/lib/messages";
import { siteChromeCopy } from "@/lib/site-chrome-copy";
import { SiteHeader } from "../site-header";
import { ThemeProvider } from "../theme-provider";
import { CareerLabShell } from "./career-lab-shell";
import { CareerProfileProvider } from "./career-profile-provider";

function storageWithProfile(): CareerStorage {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-09T12:00:00.000Z",
  });
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

function renderHeader(locale: "en" | "pt-BR") {
  navigation.pathname = `/${locale}`;
  return render(
    <ThemeProvider attribute="class">
      <SiteHeader locale={locale} />
    </ThemeProvider>,
  );
}

const careerLabIndexRoutes = [
  "/career-lab",
  "/career-lab/roadmap",
  "/career-lab/assessments",
  "/career-lab/evidence",
  "/career-lab/market",
] as const;

describe("Career Lab V1 convergence", () => {
  it.each([
    ["en", "Open navigation", "Career Lab", "LOCAL CAREER WORKSPACE"],
    ["pt-BR", "Abrir navegação", "Career Lab", "WORKSPACE LOCAL DE CARREIRA"],
  ] as const)("publishes Career Lab in shared %s navigation and chrome", (locale, openLabel, linkLabel, kicker) => {
    expect(messages[locale].navigation.careerLab).toBe(linkLabel);
    expect(siteChromeCopy[locale].header.contexts.careerLab.kicker).toBe(kicker);

    renderHeader(locale);
    fireEvent.click(screen.getByRole("button", { name: openLabel }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("link", { name: linkLabel })).toHaveAttribute(
      "href",
      `/${locale}/career-lab`,
    );
    expect(dialog.querySelectorAll(".primary-navigation__mobile-context")).toHaveLength(7);
  });

  it.each([
    ["en", "Open Career Lab"],
    ["pt-BR", "Abrir Career Lab"],
  ] as const)("cross-links only the Developer Career pack to Career Lab in %s", async (locale, label) => {
    const { unmount } = render(
      await PackDetailPage({
        params: Promise.resolve({ locale, slug: "developer-career" }),
      }),
    );

    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "href",
      `/${locale}/career-lab`,
    );
    unmount();

    render(
      await PackDetailPage({
        params: Promise.resolve({ locale, slug: "frontend-product" }),
      }),
    );
    expect(screen.queryByRole("link", { name: label })).not.toBeInTheDocument();
  });

  it.each([
    ["en", "Developer Career Pack"],
    ["pt-BR", "Pack Developer Career"],
  ] as const)("links the %s Career Lab shell back to the canonical pack", async (locale, label) => {
    render(
      <CareerProfileProvider storage={storageWithProfile()}>
        <CareerLabShell locale={locale} />
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("link", { name: label })).toHaveAttribute(
      "href",
      `/${locale}/packs/developer-career`,
    );
  });

  it("publishes localized indexable Career Lab routes in the sitemap", () => {
    const entries = sitemap();
    for (const locale of ["en", "pt-BR"] as const) {
      for (const route of careerLabIndexRoutes) {
        expect(entries).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ url: `https://skills.jhonatanoliveira.com/${locale}${route}` }),
          ]),
        );
      }
    }
  });

  it.each(["en", "pt-BR"] as const)("publishes factual, local-first Career Lab metadata in %s", async (locale) => {
    const metadata = await generateCareerLabMetadata({ params: Promise.resolve({ locale }) });
    expect(String(metadata.title)).toMatch(/Career Lab/i);
    expect(metadata.description).toMatch(/local|browser|navegador/i);
    expect(`${String(metadata.title)} ${metadata.description}`).not.toMatch(
      /official certification|accredited certification|certificação oficial|certificação acreditada|cloud sync|sincronização na nuvem/i,
    );
    expect(metadata.alternates).toEqual(
      expect.objectContaining({
        canonical: `/${locale}/career-lab`,
        languages: expect.objectContaining({
          en: "/en/career-lab",
          "pt-BR": "/pt-BR/career-lab",
        }),
      }),
    );
  });
});
