import type { Route } from "next";
import Link from "next/link";
import { EditorialMetadata } from "@/components/editorial/editorial-metadata";
import { EditorialReaderNav } from "@/components/editorial/editorial-reader-nav";
import { EditorialSectionHeading } from "@/components/editorial/editorial-section-heading";
import type { BuiltWithSkillsCase } from "@/lib/built-with-skills";
import type { LocalizedSkillDetail } from "@/lib/catalog";
import type { editorialEvidenceCopy } from "@/lib/editorial-evidence-copy";
import type { Locale } from "@/lib/locales";
import type { Messages } from "@/lib/messages";

type EvidenceCopy = (typeof editorialEvidenceCopy)[Locale];

export function EvidenceReport({
  item,
  skills,
  locale,
  copy,
  editorialCopy,
}: Readonly<{
  item: BuiltWithSkillsCase;
  skills: readonly LocalizedSkillDetail[];
  locale: Locale;
  copy: Messages["builtWithSkills"];
  editorialCopy: EvidenceCopy;
}>) {
  const readerItems = [
    { id: "challenge", label: copy.challenge },
    { id: "methods", label: copy.skillsApplied },
    { id: "decisions", label: copy.decisions },
    { id: "outcomes", label: copy.results },
    { id: "evidence", label: copy.evidence },
  ];

  return (
    <article className="shell evidence-report" data-evidence-report data-evidence-state="source-available">
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
            { label: editorialCopy.evidenceState, value: editorialCopy.sourceAvailable },
          ]}
        />
      </header>

      <div className="evidence-report__intent" aria-hidden="true">
        <span>01—05</span>
        <p>{editorialCopy.reportIntent}</p>
      </div>

      <div className="evidence-report__reader">
        <aside className="evidence-report__reader-index">
          <EditorialReaderNav label={editorialCopy.readerLabel} items={readerItems} />
        </aside>

        <div className="evidence-report__reader-content">
          <section id="challenge" className="evidence-report__challenge">
            <EditorialSectionHeading eyebrow="01" title={copy.challenge} />
            <p className="evidence-report__challenge-statement">{item.challenge}</p>
          </section>

          <section id="methods" className="evidence-report__methods">
            <EditorialSectionHeading eyebrow="02" title={copy.workflowsTitle} />
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
          </section>

          <section id="decisions" className="evidence-report__decisions">
            <EditorialSectionHeading eyebrow="03" title={copy.decisionsTitle} />
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
          </section>

          <section id="outcomes" className="evidence-report__outcomes">
            <EditorialSectionHeading eyebrow="04" title={copy.resultsTitle} />
            <ol>
              {item.results.map((result, index) => (
                <li key={result}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{result}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="evidence" className="evidence-report__evidence">
            <EditorialSectionHeading eyebrow="05" title={copy.evidence} />
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
          </section>
        </div>
      </div>
    </article>
  );
}
