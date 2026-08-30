import type { Metadata, Route } from "next";
import Link from "next/link";
import { EditorialHeroMotion } from "@/components/motion/editorial-hero-motion";
import { MethodEngine } from "@/components/motion/method-engine";
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
  const metrics = [
    [catalog.skills.length, copy.catalog.skillsCount],
    [catalog.packs.length, copy.catalog.packsCount],
    [catalog.locales.length, copy.catalog.localesCount],
  ] as const;
  const localizedMetrics = metrics.map(([count, label]) => `${count} ${label}`);
  const featuredMethods = evidence.methods.featured.map((method) => ({
    ...method,
    skill: localizedSkills.find((skill) => skill.slug === method.slug)!,
  }));
  const homeCaseLabel = locale === "pt-BR" ? "Home do Agent Skills Studio" : "Agent Skills Studio Home";
  const caseEvidenceLabel = locale === "pt-BR" ? "Case publicado" : "Published case";
  const ledgerRows = featuredMethods.map((method) => {
    const publishedCase = cases.find((item) => item.skills.includes(method.slug));

    if (publishedCase) {
      return {
        method,
        usedIn: publishedCase.title,
        usedInHref: `/${locale}/built-with-skills/${publishedCase.slug}` as Route,
        evidence: caseEvidenceLabel,
        evidenceHref: `/${locale}/built-with-skills/${publishedCase.slug}` as Route,
        external: false,
      } as const;
    }

    return {
      method,
      usedIn: homeCaseLabel,
      usedInHref: undefined,
      evidence: "PR #22",
      evidenceHref: "https://github.com/jhonatan-oliveiradev/agent-skills/pull/22",
      external: true,
    } as const;
  });

  return (
    <>
      <ScrollProgress />

      <section aria-label={evidence.acts[0].label} data-home-act="manifesto-case">
        <section aria-labelledby="home-manifesto-title" className="relative">
          <EditorialHeroMotion
            eyebrow={manifesto.eyebrow}
            summary={manifesto.summary}
            title={
              <>
                <span id="home-manifesto-title">{manifesto.titleLead}</span>
                <br /> {manifesto.titleClose}
              </>
            }
            engine={<MethodEngine copy={manifesto.engine} metrics={localizedMetrics} />}
          >
            <div className="flex flex-wrap gap-3">
              <Link className="button button--primary" href={localizePath("/skills", locale) as Route}>
                {manifesto.primaryAction}
              </Link>
              <Link className="button button--secondary" href={localizePath(manifesto.secondaryHref, locale) as Route}>
                {manifesto.secondaryAction}
              </Link>
            </div>
          </EditorialHeroMotion>
        </section>

        <section className="home-proof-v2" data-home-section="proof">
          <div className="shell">
            <div className="home-proof-v2__heading">
              <div>
                <p className="eyebrow">{evidence.proof.eyebrow}</p>
                <h2>{evidence.proof.title}</h2>
                <p>{evidence.proof.summary}</p>
              </div>
              <Link href={localizePath("/built-with-skills", locale) as Route}>{evidence.proof.viewCases} →</Link>
            </div>

            <div className="home-proof-v2__case">
              <div className="home-proof-v2__facts">
                <div><span>{evidence.proof.challengeLabel}</span><p>{evidence.proof.challenge}</p></div>
                <div>
                  <span>{evidence.proof.skillsLabel}</span>
                  <ul>
                    {featuredMethods.slice(1).map((method) => (
                      <li key={method.slug}><Link href={`/${locale}/skills/${method.slug}` as Route}>{method.slug}</Link></li>
                    ))}
                  </ul>
                </div>
                <div><span>{evidence.proof.outcomeLabel}</span><p>{evidence.proof.outcome}</p></div>
                <div>
                  <span>{evidence.proof.evidenceLabel}</span>
                  <ul className="home-proof-v2__evidence-list">
                    {evidence.proof.evidence.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="home-proof-v2__visual" aria-hidden="true">
                <figure className="home-proof-preview home-proof-preview--before">
                  <figcaption>{evidence.proof.beforeLabel}</figcaption>
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
                  <figcaption>{evidence.proof.afterLabel}</figcaption>
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

        <section className="home-transformation">
          <div className="shell">
            <div className="home-editorial-heading">
              <div><p className="eyebrow">{evidence.transformation.eyebrow}</p><h2>{evidence.transformation.title}</h2></div>
              <p>{evidence.transformation.summary}</p>
            </div>
            <ol className="home-transformation-rail">
              {evidence.transformation.stages.map((stage, index) => (
                <li key={stage.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{stage.title}</h3><p>{stage.summary}</p></li>
              ))}
            </ol>
          </div>
        </section>
      </section>

      <section aria-label={evidence.acts[1].label} data-home-act="methods-systems">
        <section className="home-methods-v2" data-home-section="methods">
          <div className="shell">
            <div className="home-editorial-heading">
              <div><p className="eyebrow">{evidence.methods.eyebrow}</p><h2>{evidence.methods.title}</h2></div>
              <div><p>{evidence.methods.summary}</p><Link href={localizePath("/skills", locale) as Route}>{evidence.methods.viewAll} →</Link></div>
            </div>
            <ol className="home-method-index">
              {featuredMethods.map((method, index) => (
                <li key={method.slug}>
                  <Link href={`/${locale}/skills/${method.slug}` as Route}>
                    <span className="home-method-index__number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="home-method-index__name"><strong>{method.skill.displayName}</strong><small>{method.discipline}</small></span>
                    <span className="home-method-index__meta">{method.skill.category}</span>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M13 7l5 5-5 5" /></svg>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="home-packs-v2" data-home-section="packs">
          <div className="shell">
            <div className="home-editorial-heading">
              <div><p className="eyebrow">{evidence.packs.eyebrow}</p><h2>{evidence.packs.title}</h2></div>
              <div><p>{evidence.packs.summary}</p><Link href={localizePath("/packs", locale) as Route}>{evidence.packs.viewAll} →</Link></div>
            </div>
            <div className="home-pack-rail">
              {activePacks.map((pack) => (
                <article key={pack.slug}>
                  <div className="home-pack-rail__meta"><span>{evidence.packs.skills.replace("{count}", String(pack.skills.length))}</span><span>{pack.version}</span></div>
                  <h3>{pack.name}</h3><p>{pack.summary}</p>
                  <ul>{pack.outcomes.slice(0, 2).map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
                  <Link href={`/${locale}/packs/${pack.slug}` as Route}>{evidence.packs.view} →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-workflow" data-home-section="workflow">
          <div className="shell">
            <div className="home-editorial-heading home-editorial-heading--wide">
              <div><p className="eyebrow">{evidence.workflow.eyebrow}</p><h2>{evidence.workflow.title}</h2></div>
              <p>{evidence.workflow.summary}</p>
            </div>
            <ol className="home-workflow-rail">
              {evidence.workflow.movements.map((movement, index) => (
                <li key={movement.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{movement.title}</h3><p>{movement.summary}</p></div></li>
              ))}
            </ol>
          </div>
        </section>
      </section>

      <section aria-label={evidence.acts[2].label} data-home-act="proof-open-system">
        <section className="home-ledger" data-home-section="ledger">
          <div className="shell">
            <div className="home-editorial-heading">
              <div><p className="eyebrow">{evidence.ledger.eyebrow}</p><h2>{evidence.ledger.title}</h2></div>
              <div><p>{evidence.ledger.summary}</p><Link href={localizePath("/built-with-skills", locale) as Route}>{evidence.ledger.viewAll} →</Link></div>
            </div>
            <div className="home-evidence-ledger">
              <table>
                <thead><tr><th scope="col">{evidence.ledger.methodLabel}</th><th scope="col">{evidence.ledger.usedInLabel}</th><th scope="col">{evidence.ledger.evidenceLabel}</th></tr></thead>
                <tbody>
                  {ledgerRows.map((row) => (
                    <tr key={row.method.slug}>
                      <td><Link href={`/${locale}/skills/${row.method.slug}` as Route}>{row.method.skill.displayName}</Link></td>
                      <td>{row.usedInHref ? <Link href={row.usedInHref}>{row.usedIn}</Link> : row.usedIn}</td>
                      <td>{row.external ? <a href={row.evidenceHref} rel="noreferrer noopener" target="_blank">{row.evidence} ↗</a> : <Link href={row.evidenceHref}>{row.evidence} →</Link>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="home-roadmap" data-home-section="roadmap">
          <div className="shell home-roadmap__inner">
            <div><p className="eyebrow">{copy.home.roadmap.eyebrow}</p><h2>{copy.home.roadmap.title}</h2><p>{copy.home.roadmap.summary}</p></div>
            <div className="hero-actions">
              <Link className="button button--primary" href={localizePath("/roadmap", locale) as Route}>{copy.home.roadmap.action}</Link>
              <Link className="button button--secondary" href={localizePath("/contribute", locale) as Route}>{copy.home.roadmap.contribute}</Link>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
