import type { Metadata, Route } from "next";
import { HomeCaseStudyStory } from "@/components/home/home-case-study-story";
import { HomeClosing } from "@/components/home/home-closing";
import { HomeEvidenceLedger } from "@/components/home/home-evidence-ledger";
import { HomeManifestoHero } from "@/components/home/home-manifesto-hero";
import { HomeMethodIndex } from "@/components/home/home-method-index";
import { HomeMethodWorkflow } from "@/components/home/home-method-workflow";
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

const homeMetadata = {
  en: {
    title: "Agent Skills Studio — Working methods for agents",
    description:
      "Explore an open, installable collection of agent skills: reusable working methods with explicit constraints and inspectable real-use evidence.",
  },
  "pt-BR": {
    title: "Agent Skills Studio — Métodos de trabalho para agentes",
    description:
      "Explore uma coleção aberta e instalável de skills para agentes: métodos de trabalho reutilizáveis, com restrições explícitas e evidências reais inspecionáveis.",
  },
} as const;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const metadata = homeMetadata[locale];

  return {
    title: metadata.title,
    description: metadata.description,
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
      outcome: skill.primaryBenefit,
      href: `/${locale}/skills/${method.slug}` as Route,
    };
  });

  const packDossiers = activePacks.map((pack) => ({
    slug: pack.slug,
    name: pack.name,
    summary: pack.summary,
    version: pack.version,
    status: pack.status,
    skillCount: pack.skills.length,
    outcomes: pack.outcomes,
    representativeSkills: pack.skills.map((skill) => skill.displayName),
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

  const caseEvidenceLinks = [
    {
      label: "PR #22",
      href: "https://github.com/jhonatan-oliveiradev/agent-skills/pull/22",
      external: true,
    },
    {
      label: evidence.caseStudy.viewCases,
      href: localizePath("/built-with-skills", locale),
      external: false,
    },
  ] as const;

  return (
    <>
      <ScrollProgress />

      <section aria-label={evidence.acts[0].label} data-home-act="manifesto-case">
        <HomeManifestoHero locale={locale} copy={manifesto} metrics={localizedMetrics} />
        <HomeCaseStudyStory
          eyebrow={evidence.caseStudy.eyebrow}
          title={evidence.caseStudy.title}
          summary={evidence.caseStudy.summary}
          stages={evidence.caseStudy.stages}
          evidenceLinks={caseEvidenceLinks}
        />
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

        <HomeMethodWorkflow
          eyebrow={evidence.workflow.eyebrow}
          title={evidence.workflow.title}
          summary={evidence.workflow.summary}
          movements={evidence.workflow.movements}
        />
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
