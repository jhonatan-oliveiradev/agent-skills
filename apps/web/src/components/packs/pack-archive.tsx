import type { LocalizedPack } from "@/lib/catalog";
import { PackDossier, type PackDossierLabels } from "./pack-dossier";

export function PackArchive({
  packs,
  locale,
  labels,
  selectionTitle,
  selectionSummary,
}: Readonly<{
  packs: readonly LocalizedPack[];
  locale: string;
  labels: PackDossierLabels;
  selectionTitle: string;
  selectionSummary: string;
}>) {
  return (
    <section className="pack-archive" data-pack-archive>
      <header
        className="pack-archive__selection pack-blueprint__planned-note"
        data-pack-selection-guide
      >
        <h2>{selectionTitle}</h2>
        <p>{selectionSummary}</p>
      </header>

      {packs.map((pack, index) => (
        <PackDossier
          key={pack.slug}
          pack={pack}
          index={index}
          href={`/${locale}/packs/${pack.slug}`}
          labels={labels}
        />
      ))}
    </section>
  );
}
