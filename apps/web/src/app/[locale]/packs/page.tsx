import type { Metadata } from "next";
import { EditorialPageHero } from "@/components/editorial/editorial-page-hero";
import { createFoundationMetadata, resolveLocale } from "@/components/foundation-route";
import { PackArchive } from "@/components/packs/pack-archive";
import { getCatalog, getLocalizedPacks } from "@/lib/catalog";
import { editorialPacksCopy } from "@/lib/editorial-packs-copy";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createFoundationMetadata(await resolveLocale(params), "packs");
}

export default async function PacksPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const catalog = getCatalog();
  const packs = getLocalizedPacks(locale);
  const copy = editorialPacksCopy[locale];
  const activeCount = packs.filter((pack) => pack.status === "active").length;
  const plannedCount = packs.length - activeCount;
  const metadata = [
    { label: copy.systemsMetric, value: String(packs.length).padStart(2, "0") },
    { label: copy.activeMetric, value: String(activeCount).padStart(2, "0") },
    { label: copy.plannedMetric, value: String(plannedCount).padStart(2, "0") },
    { label: copy.versionMetric, value: catalog.version },
  ] as const;

  return (
    <article className="shell packs-page editorial-packs-page" data-pack-archive-page>
      <EditorialPageHero
        className="editorial-packs-page__hero"
        eyebrow={copy.archiveLabel}
        title={copy.archiveTitle}
        summary={copy.archiveSummary}
        metadata={metadata}
      />

      <PackArchive
        packs={packs}
        locale={locale}
        labels={{
          active: copy.active,
          planned: copy.planned,
          methods: copy.methods,
          composition: copy.composition,
          compositionPending: copy.compositionPending,
          explore: copy.explore,
        }}
      />
    </article>
  );
}
