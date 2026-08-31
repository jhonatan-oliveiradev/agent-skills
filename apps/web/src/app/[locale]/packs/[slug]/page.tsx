import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackBlueprint } from "@/components/packs/pack-blueprint";
import {
  getCatalog,
  getLocalizedPackBySlug,
  getPackInstallCommands,
} from "@/lib/catalog";
import { editorialPacksCopy } from "@/lib/editorial-packs-copy";
import { isLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

type PackPageProps = Readonly<{ params: Promise<{ locale: string; slug: string }> }>;

export function generateStaticParams() {
  return getCatalog().packs.flatMap((pack) =>
    getCatalog().locales.map((locale) => ({ locale, slug: pack.slug })),
  );
}

export async function generateMetadata({ params }: PackPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const pack = getLocalizedPackBySlug(locale, slug);
  if (!pack) return {};

  const path = `/${locale}/packs/${slug}`;
  return {
    title: pack.name,
    description: pack.summary,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/packs/${slug}`,
        "pt-BR": `/pt-BR/packs/${slug}`,
        "x-default": `/en/packs/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      title: pack.name,
      description: pack.summary,
      url: path,
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
    },
  };
}

export default async function PackDetailPage({ params }: PackPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const pack = getLocalizedPackBySlug(locale, slug);
  if (!pack) notFound();

  const copy = messages[locale];
  const editorialCopy = editorialPacksCopy[locale];
  const commands = getPackInstallCommands(pack.slug, pack.status);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pack.name,
    description: pack.summary,
    inLanguage: locale,
    url: `https://skills.jhonatanoliveira.com/${locale}/packs/${pack.slug}`,
    numberOfItems: pack.skills.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PackBlueprint
        pack={pack}
        locale={locale}
        detail={copy.packDetail}
        skillsCopy={copy.skillsCatalog}
        commands={commands}
        compositionPending={editorialCopy.compositionPending}
        systemLabel={editorialCopy.systemLabel}
        intentLabel={editorialCopy.intentLabel}
        statusLabel={editorialCopy.statusMetric}
      />
    </>
  );
}
