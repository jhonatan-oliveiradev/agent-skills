import type { Route } from "next";
import Link from "next/link";
import { EditorialMetadata } from "@/components/editorial/editorial-metadata";
import { EditorialReaderNav } from "@/components/editorial/editorial-reader-nav";
import { EditorialSectionHeading } from "@/components/editorial/editorial-section-heading";
import type { BuiltWithSkillsCase } from "@/lib/built-with-skills";
import type { LocalizedSkillDetail } from "@/lib/catalog";
import type { CasePackRelation } from "@/lib/cross-domain-relations";
import type { editorialEvidenceCopy } from "@/lib/editorial-evidence-copy";
import { formatMethodOverlap } from "@/lib/editorial-relations-copy";
import type { Locale } from "@/lib/locales";
import type { Messages } from "@/lib/messages";

type EvidenceCopy = (typeof editorialEvidenceCopy)[Locale];

interface RelationsCopy {
  readonly relatedSystems: string;
  readonly relatedSystemsSummary: string;
  readonly methodOverlap: string;
  readonly overlapDisclaimer: string;
}

export function EvidenceReport({
  item,
  skills,
  relatedSystems,
  locale,
  copy,
  editorialCopy,
  relationsCopy,
}: Readonly<{
  item: BuiltWithSkillsCase;
  skills: readonly LocalizedSkillDetail[];
  relatedSystems: readonly CasePackRelation[];
  locale: Locale;
  copy: Messages["builtWithSkills"];
  editorialCopy: EvidenceCopy;
  relationsCopy: RelationsCopy;
}>) {
  const readerItems = [
    { id: "problem", label: editorialCopy.problem },
    { id: "methods", label: editorialCopy.methods },
    { id: "verification", label: editorialCopy.verification },
    { id: "result", label: editorialCopy.result },
  ];
  const provenanceLabel =
    item.evidenceClass === "internal"
      ? editorialCopy.internalEvidence
      : editorialCopy.realUseEvidence;

  return (
    <article
      className="shell evidence-report"
      data-evidence-report
      data-evidence-class={item.evidenceClass}
      data-evidence-state="source-available"
    >
      <Link className="evidence-report__back" href={`/${locale}/built-with-skills` as Route}>
        <span aria-hidden="true">←</span>
        {copy.back}
      </Link>

      <header className="evidence-report__hero">
        <div className="evidence-report__hero-copy">
          <p className="eyebrow">{editorialCopy.report}</p>
          <h1>{item.title}</h1>
          <p className="evidence-report__summary">{item.summary}</p>
        </div>
        <EditorialMetadata
          className="evidence-report__metadata"
          items={[
            { label: copy.published.toUpperCase(), value: item.date },
            { label: editorialCopy.methodsApplied, value: String(skills.length).padStart(2, "0") },
            { label: editorialCopy.evidenceClass, value: provenanceLabel },
            { label: editorialCopy.evidenceState, value: editorialCopy.sourceAvailable },
          ]}
        />
      </header>

      <div className="evidence-report__intent" aria-hidden="true">
        <span>01—04</span>
        <p>{editorialCopy.reportIntent}</p>
      </div>

      <div className="evidence-report__reader">
        <aside className="evidence-report__reader-index">
          <EditorialReaderNav label={editorialCopy.readerLabel} items={readerItems} />
        </aside>

        <div className="evidence-report__reader-content">
          <section id="problem" className="evidence-report__challenge">
            <EditorialSectionHeading eyebrow="01" title={editorialCopy.problem} />
            <p className="evidence-report__challenge-statement">{item.challenge}</p>
          </section>

          <section id="methods" className="evidence-report__methods">
            <EditorialSectionHeading eyebrow="02" title={editorialCopy.methods} />
            <ol className="evidence-report__method-list">
              {skills.map((skill, index) => (
                <li key={skill.slug}>
                  <Link
                    aria-label={skill.displayName}
                    data-interaction="navigate"
                    href={`/${locale}/skills/${skill.slug}` as Route}
                  >
                    <span className="evidence-report__method-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="evidence-report__method-copy">
                      <strong>{skill.displayName}</strong>
                      <span>{skill.primaryBenefit}</span>
                    </span>
                    <span className="evidence-report__method-arrow" aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ol>

            <div
              className="evidence-report__decisions evidence-report__decision-record"
              data-evidence-decision-record
            >
              <EditorialSectionHeading title={editorialCopy.decisionRecord} />
              <ol>
                {item.decisions.map((decision, index) => (
                  <li key={decision.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{decision.title}</h3>
                      <p>{decision.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {relatedSystems.length ? (
              <div className="editorial-relations evidence-report__related-systems" data-related-systems>
                <div className="editorial-relations__intro">
                  <p className="eyebrow">{relationsCopy.methodOverlap}</p>
                  <h3>{relationsCopy.relatedSystems}</h3>
                  <p>{relationsCopy.relatedSystemsSummary}</p>
                </div>
                <ul className="editorial-relations__list">
                  {relatedSystems.map((relation) => (
                    <li className="editorial-relation-row" key={relation.pack.slug}>
                      <Link
                        aria-label={relation.pack.name}
                        data-interaction="connect"
                        href={`/${locale}/packs/${relation.pack.slug}` as Route}
                      >
                        <span className="editorial-relation-row__eyebrow">
                          {relationsCopy.methodOverlap}
                        </span>
                        <strong>{relation.pack.name}</strong>
                        <span className="editorial-relation-row__meta">
                          {formatMethodOverlap(
                            locale,
                            relation.matchingSkillSlugs.length,
                            relation.pack.skills.length,
                          )}
                        </span>
                        <span className="editorial-relation-row__arrow" aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="editorial-relations__disclaimer">{relationsCopy.overlapDisclaimer}</p>
              </div>
            ) : null}
          </section>

          <section id="verification" className="evidence-report__evidence">
            <EditorialSectionHeading eyebrow="03" title={editorialCopy.verification} />
            <div className="evidence-report__evidence-state">
              <span>{editorialCopy.evidenceState}</span>
              <strong>{editorialCopy.sourceAvailable}</strong>
            </div>
            <div className="evidence-report__records">
              {item.evidence.map((entry) => (
                <a
                  aria-label={entry.label}
                  data-evidence-type={entry.type}
                  href={entry.href}
                  key={`${entry.type}-${entry.href}`}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <span>{entry.type === "source" ? editorialCopy.sourceType : entry.type.toUpperCase()}</span>
                  <strong>{entry.label}</strong>
                  <span>{editorialCopy.openEvidence}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <p className="evidence-report__scope-note" data-evidence-scope-note>
              {editorialCopy.scopeNote}
            </p>
          </section>

          <section id="result" className="evidence-report__outcomes">
            <EditorialSectionHeading eyebrow="04" title={editorialCopy.result} />
            <ol>
              {item.results.map((result, index) => (
                <li key={result}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{result}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}
