import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { messages } from "@/lib/messages";

export type FoundationSection = "skills" | "packs" | "roadmap" | "about";
type LocaleParams = Promise<{ locale: string }>;

export async function resolveLocale(params: LocaleParams): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export function createFoundationMetadata(
  locale: Locale,
  section: FoundationSection,
): Metadata {
  const page = messages[locale].foundation[section];

  return {
    title: page.title,
    description: page.summary,
    alternates: {
      canonical: `/${locale}/${section}`,
      languages: {
        en: `/en/${section}`,
        "pt-BR": `/pt-BR/${section}`,
        "x-default": `/en/${section}`,
      },
    },
  };
}

export function FoundationRoute({
  locale,
  section,
}: Readonly<{ locale: Locale; section: FoundationSection }>) {
  const copy = messages[locale].foundation;
  const page = copy[section];

  return (
    <article className="shell foundation-route">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1>{page.title}</h1>
      <p className="foundation-route__summary">{page.summary}</p>
      <aside className="status-note">{copy.note}</aside>
    </article>
  );
}
