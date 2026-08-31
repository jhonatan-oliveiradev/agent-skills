import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EvidenceReport } from "@/components/evidence/evidence-report";
import { getBuiltWithSkillsCaseBySlug, getBuiltWithSkillsSlugs } from "@/lib/built-with-skills";
import { getLocalizedSkillBySlug, getSupportedLocales } from "@/lib/catalog";
import { editorialEvidenceCopy } from "@/lib/editorial-evidence-copy";
import { isLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string; slug: string }> }>;

export function generateStaticParams() {
  return getSupportedLocales().flatMap((locale) =>
    getBuiltWithSkillsSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const item = getBuiltWithSkillsCaseBySlug(locale, slug);
  if (!item) return {};

  const path = `/${locale}/built-with-skills/${slug}`;
  return {
    title: item.title,
    description: item.summary,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/built-with-skills/${slug}`,
        "pt-BR": `/pt-BR/built-with-skills/${slug}`,
        "x-default": `/en/built-with-skills/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary,
      url: path,
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
    },
  };
}

export default async function BuiltWithSkillsDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const item = getBuiltWithSkillsCaseBySlug(locale, slug);
  if (!item) notFound();

  const skills = item.skills.map((skillSlug) => getLocalizedSkillBySlug(locale, skillSlug)!);

  return (
    <EvidenceReport
      item={item}
      skills={skills}
      locale={locale}
      copy={messages[locale].builtWithSkills}
      editorialCopy={editorialEvidenceCopy[locale]}
    />
  );
}
