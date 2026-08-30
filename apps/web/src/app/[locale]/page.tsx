import type { Metadata, Route } from "next";
import Link from "next/link";
import { HomeClosing } from "@/components/home/home-closing";
import { HomeEvidenceLedger } from "@/components/home/home-evidence-ledger";
import { HomeManifestoHero } from "@/components/home/home-manifesto-hero";
import { HomeMethodIndex } from "@/components/home/home-method-index";
import { HomePackDossiers } from "@/components/home/home-pack-dossiers";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { resolveLocale } from "@/components/foundation-route";
import { getBuiltWithSkillsCases } from "@/lib/built-with-skills";
import { getCatalog, getLocalizedPacks, getLocalizedSkills } from "@/lib/catalog";
import { homeEvidenceContent } from "@/lib/home-evidence-content";
import { homeManifesto } from "@/lib/home-content";
import { localizePath } from "@/lib/i18n";
import { messages } from "@/lib/messages";

type HomePageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const copy = messages[locale].metadata;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "pt-BR": "/pt-BR",
        "x-default": "/en",
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = await resolveLocale(params);
  const copy = messages[locale];
  const manifesto = homeManifesto[locale];
  const evidence = homeEvidenceContent[locale];
  const catalog = getCatalog();
  const localizedSkills = getLocalizedSkills(locale);
  const activePacks = getLocalizedPacks(locale).filter((pack) => pack.status === "active");
  const cases = getBuiltWithSkillsCases(locale);

  const localizedMetrics = [
    `${catalog.skills.length} ${copy.catalog.skillsCount}`,
    `${catalog.packs.length} ${copy.catalog.packsCount}`,
    `${catalog.locales.length} ${copy.catalog.localesCount}`,
  ];

  const featuredMethods = evidence.methods.featured.map((method) => {
    const skill = localizedSkills.find((item) => item.slug === method.slug)!;
    return {
      slug: method.slug,
      displayName: skill.displayName,
      discipline: method.discipline,
      category: skill.category,
      href: `/${locale}/skills/${method.slug}` as Route,
    };
  });

  const packDossiers = activePacks.map((pack) => ({
    slug: pack.slug,
    name: pack.name,
    summary: pack.summary,
    version: pack.version,
    skillCount: pack.skills.length,
    outcomes: pack.outcomes,
    href: `/${locale}/packs/${pack.slug}` as Route,
  }));

  const homeCaseLabel = locale === "pt-BR" ? "Home do Agent Skills Studio" : "Agent Skills Studio Home";
  const caseEvidenceLabel = locale === "pt-BR" ? "Case publicado" : "Published case";
  const ledgerRows = featuredMethods.map((method) => {
    const publishedCase = cases.find((item) => item.skills.includes(method.slug));

    if (publishedCase) {
      return {
        id: method.slug,
        method: method.displayName,
        methodHref: method.href,
        usedIn: publishedCase.title,
        usedInHref: `/${locale}/built-with-skills/${publishedCase.slug}` as Route,
        evidence: caseEvidenceLabel,
        evidenceHref: `/${locale}/built-with-skills/${publishedCase.slug}` as Route,
        external: false,
      };
    }

    return {
      id: method.slug,
      method: method.displayName,
      methodHref: method.href,
      usedIn: homeCaseLabel,
      evidence: "PR #22",
      evidenceHref: "https://github.com/jhonatan-oliveiradev/agent-skills/pull/22",
      external: true,
    };
  });

  return (
    <>
      <ScrollProgress />

      <section aria-label={evidence.acts[0].label} data-home-act="manifesto-case">
        <HomeManifestoHero locale={locale} copy={manifesto} metrics={localizedMetrics} />

        <section className="home-proof-v2" data-home-section="proof">
          <div className="shell">
            <div className="home-proof-v2__heading">
              <div>
                <p className="eyebrow">{evidence.caseStudy.eyebrow}</p>
                <h2>{evidence.caseStudy.title}</h2>
                <p>{evidence.caseStudy.summary}</p>
              </div>
              <Link href={localizePath("/built-with-skills", locale) as Route}>
                {evidence.caseStudy.viewCases} →
              </Link>
            </div>

            <div className="home-proof-v2__case">
              <ol className="home-transformation-rail" aria-label={evidence.caseStudy.title}>
                {evidence.caseStudy.stages.map((stage) => (
                  <li key={stage.id} data-case-stage={stage.id}>
                    <span>{stage.eyebrow}</span>
                    <h3>{stage.title}</h3>
                    <p>{stage.summary}</p>
                  </li>
                ))}
              </ol>

              <div className="home-proof-v2__visual" aria-hidden="true">
                <figure className="home-proof-preview home-proof-preview--before">
                  <figcaption>{evidence.caseStudy.beforeLabel}</figcaption>
                  <div className="home-proof-preview__browser">
                    <div className="home-proof-preview__bar"><i /><i /><i /></div>
                    <div className="home-proof-preview__before-layout">
                      <div><b /><span /><span /><span /><em /></div>
                      <aside><span /><span /><span /></aside>
                    </div>
                  </div>
                </figure>
                <div className="home-proof-v2__transition" />
                <figure className="home-proof-preview home-proof-preview--after">
                  <figcaption>{evidence.caseStudy.afterLabel}</figcaption>
                  <div className="home-proof-preview__browser">
                    <div className="home-proof-preview__bar"><i /><i /><i /></div>
                    <div className="home-proof-preview__after-layout">
                      <div className="home-proof-preview__veil" />
                      <div className="home-proof-preview__manifesto"><b /><strong /><strong /><span /></div>
                      <aside><span /><span /><span /><em /></aside>
                    </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section aria-label={evidence.acts[1].label} data-home-act="methods-systems">
        <HomeMethodIndex
          eyebrow={evidence.methods.eyebrow}
          title={evidence.methods.title}
          summary={evidence.methods.summary}
          viewAllLabel={evidence.methods.viewAll}
          viewAllHref={localizePath("/skills", locale) as Route}
          methods={featuredMethods}
        />

        <HomePackDossiers
          eyebrow={evidence.packs.eyebrow}
          title={evidence.packs.title}
          summary={evidence.packs.summary}
          skillsTemplate={evidence.packs.skills}
          viewLabel={evidence.packs.view}
          viewAllLabel={evidence.packs.viewAll}
          viewAllHref={localizePath("/packs", locale) as Route}
          packs={packDossiers}
        />

        <section className="home-workflow" data-home-section="workflow">
          <div className="shell">
            <div className="home-editorial-heading home-editorial-heading--wide">
              <div>
                <p className="eyebrow">{evidence.workflow.eyebrow}</p>
                <h2>{evidence.workflow.title}</h2>
              </div>
              <p>{evidence.workflow.summary}</p>
            </div>
            <ol className="home-workflow-rail">
              {evidence.workflow.movements.map((movement, index) => (
                <li key={movement.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{movement.title}</h3><p>{movement.summary}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </section>

      <section aria-label={evidence.acts[2].label} data-home-act="proof-open-system">
        <HomeEvidenceLedger
          eyebrow={evidence.ledger.eyebrow}
          title={evidence.ledger.title}
          summary={evidence.ledger.summary}
          methodLabel={evidence.ledger.methodLabel}
          usedInLabel={evidence.ledger.usedInLabel}
          evidenceLabel={evidence.ledger.evidenceLabel}
          viewAllLabel={evidence.ledger.viewAll}
          viewAllHref={localizePath("/built-with-skills", locale) as Route}
          rows={ledgerRows}
        />
        <HomeClosing locale={locale} copy={copy.home.roadmap} />
      </section>
    </>
  );
}
