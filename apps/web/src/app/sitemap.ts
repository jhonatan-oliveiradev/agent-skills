import type { MetadataRoute } from "next";
import { getBuiltWithSkillsCases } from "@/lib/built-with-skills";
import { getCatalog } from "@/lib/catalog";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://skills.jhonatanoliveira.com").replace(
  /\/$/,
  "",
);

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

function localizedUrl(locale: string, path: string) {
  return `${siteUrl}/${locale}${path}`;
}

function alternates(path: string) {
  return {
    languages: {
      en: localizedUrl("en", path),
      "pt-BR": localizedUrl("pt-BR", path),
      "x-default": localizedUrl("en", path),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = getCatalog();
  const evidenceSlugs = getBuiltWithSkillsCases("en").map((item) => item.slug);
  const publicPaths = [
    ...localizedIndexRoutes,
    ...catalog.skills.map((skill) => `/skills/${skill.slug}` as const),
    ...catalog.packs.map((pack) => `/packs/${pack.slug}` as const),
    ...evidenceSlugs.map((slug) => `/built-with-skills/${slug}` as const),
  ];

  return catalog.locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: localizedUrl(locale, path),
      alternates: alternates(path),
    })),
  );
}
