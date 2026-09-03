import type { Route } from "next";
import Link from "next/link";
import { EditorialHeroMotion } from "@/components/motion/editorial-hero-motion";
import { MethodEngine } from "@/components/motion/method-engine";
import { homeManifesto } from "@/lib/home-content";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

type HomeManifestoCopy = (typeof homeManifesto)[Locale];

export type HomeManifestoHeroProps = Readonly<{
  locale: Locale;
  copy: HomeManifestoCopy;
  metrics: readonly string[];
}>;

export function HomeManifestoHero({ locale, copy, metrics }: HomeManifestoHeroProps) {
  return (
    <section aria-labelledby="home-manifesto-title" className="relative">
      <EditorialHeroMotion
        eyebrow={copy.eyebrow}
        summary={copy.summary}
        title={
          <>
            <span id="home-manifesto-title">{copy.titleLead}</span>
            <br /> {copy.titleClose}
          </>
        }
        engine={<MethodEngine copy={copy.engine} metrics={metrics} />}
      >
        <div className="home-manifesto-actions flex flex-wrap gap-3">
          <Link className="button button--primary" href={localizePath("/skills", locale) as Route}>
            {copy.primaryAction}
          </Link>
          <Link className="button button--secondary" href={localizePath(copy.secondaryHref, locale) as Route}>
            {copy.secondaryAction}
          </Link>
        </div>
      </EditorialHeroMotion>
    </section>
  );
}
