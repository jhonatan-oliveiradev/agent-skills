import type { ReactNode } from "react";
import "../../editorial-foundation.css";
import "../../home-evidence.css";
import "../../home-living-archive.css";
import "../../home-living-systems.css";
import "../../home-scroll-choreography.css";
import "../../home-scroll-systems.css";
import "../../home-scroll-workflow.css";
import "../../home-final-polish.css";
import "../../editorial-pages.css";
import "../../editorial-secondary.css";
import "../../editorial-living-program.css";
import "../../editorial-colophon.css";
import "../../editorial-institutional.css";
import "../../editorial-methods.css";
import "../../editorial-method-dossier.css";
import "../../editorial-packs.css";
import "../../editorial-pack-blueprint.css";
import "../../editorial-pack-distribution.css";
import "../../editorial-detail-layout.css";
import "../../editorial-evidence.css";
import "../../editorial-evidence-report.css";
import "../../editorial-relations.css";
import "../../site-chrome.css";
import "../../site-chrome-responsive.css";
import "../../site-chrome-refinement.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { resolveLocale } from "@/components/foundation-route";

type LayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function StudioLayout({ children, params }: LayoutProps) {
  const locale = await resolveLocale(params);

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
