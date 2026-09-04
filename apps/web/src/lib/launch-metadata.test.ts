import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getBuiltWithSkillsCases } from "@/lib/built-with-skills";
import { getCatalog } from "@/lib/catalog";

const siteUrl = "https://skills.jhonatanoliveira.com";
const localizedIndexRoutes = [
  "",
  "/skills",
  "/packs",
  "/built-with-skills",
  "/getting-started",
  "/roadmap",
  "/about",
  "/contribute",
  "/changelog",
] as const;

describe("launch discovery metadata", () => {
  it("publishes every localized public route in the sitemap", () => {
    const catalog = getCatalog();
    const evidenceCases = getBuiltWithSkillsCases("en");
    const entries = sitemap();
    const expectedPerLocale =
      localizedIndexRoutes.length + catalog.skills.length + catalog.packs.length + evidenceCases.length;

    expect(entries).toHaveLength(expectedPerLocale * catalog.locales.length);

    for (const locale of catalog.locales) {
      for (const route of localizedIndexRoutes) {
        expect(entries).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ url: `${siteUrl}/${locale}${route}` }),
          ]),
        );
      }
    }

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: `${siteUrl}/en/skills/${catalog.skills[0]!.slug}`,
          alternates: expect.objectContaining({
            languages: expect.objectContaining({
              en: `${siteUrl}/en/skills/${catalog.skills[0]!.slug}`,
              "pt-BR": `${siteUrl}/pt-BR/skills/${catalog.skills[0]!.slug}`,
            }),
          }),
        }),
        expect.objectContaining({ url: `${siteUrl}/pt-BR/packs/${catalog.packs[0]!.slug}` }),
        expect.objectContaining({ url: `${siteUrl}/en/built-with-skills/${evidenceCases[0]!.slug}` }),
      ]),
    );
  });

  it("publishes crawl policy and points robots to the canonical sitemap", () => {
    expect(robots()).toEqual(
      expect.objectContaining({
        rules: expect.objectContaining({ userAgent: "*", allow: "/" }),
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
      }),
    );
  });
});
