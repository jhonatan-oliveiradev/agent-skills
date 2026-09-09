import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorialPageHero } from "@/components/editorial/editorial-page-hero";
import {
  createFoundationMetadata,
  resolveLocale,
} from "@/components/foundation-route";
import { MethodArchive } from "@/components/skills/method-archive";
import { getCatalog, getLocalizedPackNames, getLocalizedSkills } from "@/lib/catalog";
import { editorialMethodsCopy } from "@/lib/editorial-methods-copy";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createFoundationMetadata(await resolveLocale(params), "skills");
}

export default async function SkillsPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const catalog = getCatalog();
  const packNames = getLocalizedPackNames(locale);
  const skillCopy = messages[locale].skillsCatalog;
  const editorialCopy = editorialMethodsCopy[locale];
  const categoryNames: Readonly<Record<string, string>> = {
    ...skillCopy.categories,
    ...editorialCopy.categoryLabels,
  };
  const archiveCopy = {
    ...skillCopy,
    searchLabel: editorialCopy.searchLabel,
    searchPlaceholder: editorialCopy.searchPlaceholder,
    noResultsTitle: editorialCopy.noResultsTitle,
    noResultsSummary: editorialCopy.noResultsSummary,
    clear: editorialCopy.clearFilters,
    categories: categoryNames,
  };
  const localizedSkills = getLocalizedSkills(locale);
  const activePacks = new Set(localizedSkills.flatMap((skill) => skill.packs));
  const metadata = [
    { label: editorialCopy.methodsMetric, value: String(localizedSkills.length).padStart(2, "0") },
    { label: editorialCopy.packsMetric, value: String(activePacks.size).padStart(2, "0") },
    { label: editorialCopy.categoriesMetric, value: String(catalog.filters.categories.length).padStart(2, "0") },
    { label: editorialCopy.versionMetric, value: catalog.version },
  ] as const;

  return (
    <article className="shell editorial-page methods-page" data-method-archive-page>
      <EditorialPageHero
        className="methods-page__hero"
        eyebrow={editorialCopy.archiveLabel}
        title={editorialCopy.archiveTitle}
        summary={editorialCopy.archiveSummary}
        metadata={metadata}
      />

      <Suspense fallback={<div className="catalog-loading method-archive__loading">{skillCopy.loading}</div>}>
        <MethodArchive
          skills={localizedSkills}
          locale={locale}
          copy={archiveCopy}
          filterLabel={editorialCopy.filterLabel}
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