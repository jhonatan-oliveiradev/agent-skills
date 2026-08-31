import type { LocalizedPack } from "@/lib/catalog";
import { PackDossier, type PackDossierLabels } from "./pack-dossier";

export function PackArchive({
  packs,
  locale,
  labels,
}: Readonly<{
  packs: readonly LocalizedPack[];
  locale: string;
  labels: PackDossierLabels;
}>) {
  return (
    <section className="pack-archive" data-pack-archive>
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
