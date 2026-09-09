import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MethodDossier } from "@/components/skills/method-dossier";
import { getBuiltWithSkillsCases } from "@/lib/built-with-skills";
import {
  getCatalog,
  getLocalizedPacks,
  getLocalizedSkillBySlug,
  getSkillInstallCommands,
} from "@/lib/catalog";
import { getCasesUsingSkill, getPacksContainingSkill } from "@/lib/cross-domain-relations";
import { skillDistributionCopy } from "@/lib/distribution-copy";
import { editorialMethodsCopy } from "@/lib/editorial-methods-copy";
import { editorialRelationsCopy } from "@/lib/editorial-relations-copy";
import { isLocale } from "@/lib/i18n";
import { getChatgptSkillDownload } from "@/lib/installation";
import { messages } from "@/lib/messages";

const repositoryUrl = "https://github.com/jhonatan-oliveiradev/agent-skills";

type SkillPageProps = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export function generateStaticParams() {
  return getCatalog().skills.flatMap((skill) =>
    getCatalog().locales.map((locale) => ({ locale, slug: skill.slug })),
  );
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const skill = getLocalizedSkillBySlug(locale, slug);
  if (!skill) return {};

  const path = `/${locale}/skills/${slug}`;
  return {
    title: skill.displayName,
    description: skill.summary,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/skills/${slug}`,
        "pt-BR": `/pt-BR/skills/${slug}`,
        "x-default": `/en/skills/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: skill.displayName,
      description: skill.summary,
      url: path,
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
    },
  };
}

export default async function SkillDetailPage({ params }: SkillPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const skill = getLocalizedSkillBySlug(locale, slug);
  if (!skill) notFound();

  const copy = messages[locale];
  const detail = copy.skillDetail;
  const categoryNames: Readonly<Record<string, string>> = copy.skillsCatalog.categories;
  const commands = getSkillInstallCommands(skill.slug);
  const chatgptDownload = getChatgptSkillDownload(skill.slug, skill.version);
  const relatedPacks = getPacksContainingSkill(getLocalizedPacks(locale), skill.slug);
  const evidenceCases = getCasesUsingSkill(getBuiltWithSkillsCases(locale), skill.slug);
  const category = categoryNames[skill.category] ?? skill.category;
  const difficulty =
    copy.skillsCatalog.values[skill.difficulty as keyof typeof copy.skillsCatalog.values] ??
    skill.difficulty;
  const maturity =
    copy.skillsCatalog.values[skill.maturity as keyof typeof copy.skillsCatalog.values] ??
    skill.maturity;
  const sourceUrl = `${repositoryUrl}/tree/main/skills/${skill.slug}`;
  const methodIndex = getCatalog().skills.findIndex((candidate) => candidate.slug === skill.slug);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: skill.displayName,
    description: skill.summary,
    inLanguage: locale,
    dateModified: skill.updatedAt,
    version: skill.version,
    url: `https://skills.jhonatanoliveira.com/${locale}/skills/${skill.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MethodDossier
        skill={skill}
        index={methodIndex}
        locale={locale}
        category={category}
        difficulty={difficulty}
        maturity={maturity}
        relatedPacks={relatedPacks}
        evidenceCases={evidenceCases}
        commands={commands}
        chatgptDownload={chatgptDownload}
        chatgptDownloadCopy={skillDistributionCopy[locale]}
        sourceUrl={sourceUrl}
        detail={detail}
        catalogCopy={copy.skillsCatalog}
        editorialCopy={editorialMethodsCopy[locale]}
        relationsCopy={editorialRelationsCopy[locale]}
      />
    </>
  );
}
