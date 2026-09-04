import type { Route } from "next";
import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";
import { EditorialMetadata } from "@/components/editorial/editorial-metadata";
import { EditorialReaderNav } from "@/components/editorial/editorial-reader-nav";
import { EditorialSectionHeading } from "@/components/editorial/editorial-section-heading";
import type { LocalizedPack } from "@/lib/catalog";
import type { PackEvidenceRelation } from "@/lib/cross-domain-relations";
import { formatMethodOverlap } from "@/lib/editorial-relations-copy";
import type { Locale } from "@/lib/locales";
import type { Messages } from "@/lib/messages";
import { PackCompositionMap } from "./pack-composition-map";

interface PackInstallCommands {
  readonly bash: string;
  readonly powershell: string;
}

interface RelationsCopy {
  readonly relatedEvidence: string;
  readonly relatedEvidenceSummary: string;
  readonly inspectReport: string;
  readonly methodOverlap: string;
  readonly overlapDisclaimer: string;
}

export interface PackBlueprintProps {
  readonly pack: LocalizedPack;
  readonly locale: Locale;
  readonly detail: Messages["packDetail"];
  readonly skillsCopy: Messages["skillsCatalog"];
  readonly commands: PackInstallCommands | undefined;
  readonly evidenceRelations: readonly PackEvidenceRelation[];
  readonly relationsCopy: RelationsCopy;
  readonly compositionPending: string;
  readonly systemLabel: string;
  readonly intentLabel: string;
  readonly statusLabel: string;
  readonly usageTitle: string;
  readonly usageSummary: string;
}

export function PackBlueprint(props: Readonly<PackBlueprintProps>) {
  const {
    pack,
    locale,
    detail,
    skillsCopy,
    commands,
    evidenceRelations,
    relationsCopy,
    compositionPending,
    systemLabel,
    intentLabel,
    statusLabel,
    usageTitle,
    usageSummary,
  } = props;
  const active = pack.status === "active";
  const status = active ? detail.active : detail.planned;
  const readerItems = [
    { id: "usage", label: usageTitle },
    { id: "outcomes", label: detail.outcomes },
    ...(!active ? [{ id: "roadmap-status", label: detail.plannedTitle }] : []),
    { id: "composition", label: detail.composition },
    ...(evidenceRelations.length ? [{ id: "evidence", label: relationsCopy.relatedEvidence }] : []),
    ...(commands ? [{ id: "installation", label: detail.installation }] : []),
  ];

  return (
    <article className="shell pack-blueprint" data-pack-state={pack.status} data-color={pack.color}>
      <Link className="pack-blueprint__back" href={`/${locale}/packs` as Route}>
        <span aria-hidden="true">←</span>{detail.back}
      </Link>

      <header className="pack-blueprint__hero" data-pack-blueprint="hero">
        <div className="pack-blueprint__hero-copy">
          <p className="eyebrow">{systemLabel} / {status}</p>
          <h1>{pack.name}</h1>
          <p className="pack-blueprint__summary">{pack.summary}</p>
        </div>
        <EditorialMetadata
          className="pack-blueprint__metadata"
          items={[
            { label: detail.skills.toUpperCase(), value: String(pack.skills.length).padStart(2, "0") },
            { label: detail.version.toUpperCase(), value: pack.version },
            { label: statusLabel, value: status },
          ]}
        />
      </header>

      <section className="pack-blueprint__intent" aria-label={pack.name} data-intent-label={intentLabel}>
        <p>{pack.description}</p>
      </section>

      <div className="pack-blueprint__reader">
        <aside className="pack-blueprint__reader-index">
          <EditorialReaderNav
            label={locale === "pt-BR" ? "Neste sistema" : "In this system"}
            items={readerItems}
          />
        </aside>

        <div className="pack-blueprint__reader-content">
          <section id="usage" className="pack-blueprint__usage pack-blueprint__planned-note" data-pack-usage>
            <h2>{usageTitle}</h2>
            <p>{usageSummary}</p>
          </section>

          <section id="outcomes" className="pack-blueprint__outcomes">
            <EditorialSectionHeading title={detail.outcomes} />
            <ol>
              {pack.outcomes.map((outcome, index) => (
                <li data-pack-outcome key={outcome}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{outcome}</p>
                </li>
              ))}
            </ol>
          </section>

          {!active ? (
            <section id="roadmap-status" className="pack-blueprint__planned-note">
              <p className="eyebrow">{detail.planned}</p>
              <h2>{detail.plannedTitle}</h2>
              <p>{detail.plannedSummary}</p>
            </section>
          ) : null}

          <div id="composition" className="pack-blueprint__composition-anchor">
            <PackCompositionMap
              skills={pack.skills}
              locale={locale}
              labels={{ composition: detail.composition, benefit: skillsCopy.benefit, pending: compositionPending }}
            />
          </div>

          {evidenceRelations.length ? (
            <section
              className="pack-blueprint__evidence editorial-relations"
              data-pack-evidence
              id="evidence"
            >
              <EditorialSectionHeading
                title={relationsCopy.relatedEvidence}
                summary={relationsCopy.relatedEvidenceSummary}
              />
              <ul className="editorial-relations__list">
                {evidenceRelations.map((relation) => (
                  <li
                    className="editorial-relation-row"
                    data-pack-evidence-relation
                    key={relation.case.slug}
                  >
                    <Link
                      aria-label={relation.case.title}
                      data-interaction="connect"
                      href={`/${locale}/built-with-skills/${relation.case.slug}` as Route}
                    >
                      <span className="editorial-relation-row__eyebrow">
                        {relationsCopy.methodOverlap}
                      </span>
                      <strong>{relation.case.title}</strong>
                      <span className="editorial-relation-row__meta">
                        {formatMethodOverlap(
                          locale,
                          relation.matchingSkillSlugs.length,
                          pack.skills.length,
                        )}
                      </span>
                      <span className="editorial-relation-row__arrow" aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="editorial-relations__disclaimer">{relationsCopy.overlapDisclaimer}</p>
            </section>
          ) : null}

          {commands ? (
            <section id="installation" className="pack-blueprint__installation">
              <EditorialSectionHeading title={detail.installation} summary={detail.installationSummary} />
              <div className="pack-blueprint__commands">
                <div><p>{detail.bash}</p><CopyCommand command={commands.bash} label={detail.copy} copiedLabel={detail.copied} /></div>
                <div><p>{detail.powershell}</p><CopyCommand command={commands.powershell} label={detail.copy} copiedLabel={detail.copied} /></div>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
