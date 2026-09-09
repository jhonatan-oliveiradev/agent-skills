import type { Metadata } from "next";
import { EvidenceArchive } from "@/components/evidence/evidence-archive";
import { resolveLocale } from "@/components/foundation-route";
import { getBuiltWithSkillsCases } from "@/lib/built-with-skills";
import { getLocalizedSkills } from "@/lib/catalog";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const copy = messages[locale].builtWithSkills;
  return {
    title: copy.title,
    description: copy.summary,
    alternates: {
      canonical: `/${locale}/built-with-skills`,
      languages: {
        en: "/en/built-with-skills",
        "pt-BR": "/pt-BR/built-with-skills",
        "x-default": "/en/built-with-skills",
      },
    },
  };
}

export default async function BuiltWithSkillsPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const cases = getBuiltWithSkillsCases(locale);
  const skills = Object.fromEntries(
    getLocalizedSkills(locale).map((skill) => [
      skill.slug,
      { slug: skill.slug, displayName: skill.displayName },
    ]),
  );

  return <EvidenceArchive cases={cases} locale={locale} skills={skills} />;
}
