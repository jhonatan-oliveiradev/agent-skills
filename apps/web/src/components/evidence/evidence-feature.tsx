import type { Route } from "next";
import Link from "next/link";
import type { BuiltWithSkillsCase } from "@/lib/built-with-skills";

export function EvidenceFeature({
  item,
  locale,
  index,
  leading,
  skills,
  labels,
}: Readonly<{
  item: BuiltWithSkillsCase;
  locale: string;
  index: number;
  leading: boolean;
  skills: readonly { readonly slug: string; readonly displayName: string }[];
  labels: Readonly<{
    leading: string;
    report: string;
    methodsApplied: string;
    sourceAvailable: string;
    inspect: string;
    evidenceRecord: string;
  }>;
}>) {
  const source = item.evidence.find((entry) => entry.type === "source");

  return (
    <article
      className="evidence-feature"
      data-evidence-feature
      data-evidence-leading={leading ? "true" : "false"}
      data-evidence-state="source-available"
      data-interaction="inspect"
    >
      <div className="evidence-feature__ordinal" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="evidence-feature__body">
        <div className="evidence-feature__meta">
          <span>{leading ? labels.leading : labels.report}</span>
          <span>{item.date}</span>
          <span>{labels.sourceAvailable}</span>
        </div>

        <Link
          className="evidence-feature__main-link"
          data-interaction="navigate"
          href={`/${locale}/built-with-skills/${item.slug}` as Route}
        >
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
          <span className="evidence-feature__action">{labels.inspect} <span aria-hidden="true">↗</span></span>
        </Link>

        <div className="evidence-feature__methods">
          <p>{labels.methodsApplied}</p>
          <ol>
            {skills.map((skill, skillIndex) => (
              <li key={skill.slug}>
                <span>{String(skillIndex + 1).padStart(2, "0")}</span>
                <span>{skill.displayName}</span>
              </li>
            ))}
          </ol>
        </div>

        {source ? (
          <a
            className="evidence-feature__source"
            href={source.href}
            rel="noreferrer noopener"
            target="_blank"
          >
            <span>{labels.evidenceRecord}</span>
            <strong>{source.label}</strong>
            <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
