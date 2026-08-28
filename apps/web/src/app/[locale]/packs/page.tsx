import type { Metadata } from "next";
import { createFoundationMetadata, resolveLocale } from "@/components/foundation-route";
import { PackCard } from "@/components/pack-card";
import { getLocalizedPacks } from "@/lib/catalog";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createFoundationMetadata(await resolveLocale(params), "packs");
}

export default async function PacksPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const copy = messages[locale];
  const packs = getLocalizedPacks(locale);

  return (
    <article className="shell packs-page">
      <header className="packs-page__header">
        <p className="eyebrow">{copy.packCatalog.eyebrow}</p>
        <h1>{copy.foundation.packs.title}</h1>
        <p>{copy.packCatalog.summary}</p>
      </header>
      <section className="pack-grid" aria-label={copy.navigation.packs}>
        {packs.map((pack) => (
          <PackCard
            key={pack.slug}
            pack={pack}
            href={`/${locale}/packs/${pack.slug}`}
            labels={copy.packCatalog}
          />
        ))}
      </section>
    </article>
  );
}
