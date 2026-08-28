import type { Metadata } from "next";
import { Suspense } from "react";
import {
  createFoundationMetadata,
  resolveLocale,
} from "@/components/foundation-route";
import { SkillsCatalog } from "@/components/skills-catalog";
import { getCatalog, getLocalizedPackNames, getLocalizedSkills } from "@/lib/catalog";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createFoundationMetadata(await resolveLocale(params), "skills");
}

export default async function SkillsPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const catalog = getCatalog();
  const packNames = getLocalizedPackNames(locale);
  const copy = messages[locale];
  const skillCopy = copy.skillsCatalog;
  const categoryNames: Readonly<Record<string, string>> = skillCopy.categories;
  const localizedSkills = getLocalizedSkills(locale);
  const activePacks = new Set(localizedSkills.flatMap((skill) => skill.packs));

  return (
    <article className="shell skills-page">
      <header className="skills-page__header">
        <p className="eyebrow">{copy.foundation.eyebrow}</p>
        <h1>{copy.foundation.skills.title}</h1>
        <p>{copy.foundation.skills.summary}</p>
      </header>
      <Suspense fallback={<div className="catalog-loading">{skillCopy.loading}</div>}>
        <SkillsCatalog
          skills={localizedSkills}
          locale={locale}
          copy={skillCopy}
          options={{
            categories: catalog.filters.categories.map((value) => ({
              value,
              label: categoryNames[value] ?? value.replaceAll("-", " "),
            })),
            packs: catalog.filters.packs
              .filter((value) => activePacks.has(value))
              .map((value) => ({ value, label: packNames[value] ?? value })),
            difficulties: catalog.filters.difficulty.map((value) => ({
              value,
              label: skillCopy.values[value as keyof typeof skillCopy.values] ?? value,
            })),
            maturities: catalog.filters.maturity.map((value) => ({
              value,
              label: skillCopy.values[value as keyof typeof skillCopy.values] ?? value,
            })),
          }}
        />
      </Suspense>
    </article>
  );
}
