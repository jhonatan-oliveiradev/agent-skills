import { EditorialPageHero } from "@/components/editorial/editorial-page-hero";
import type { BuiltWithSkillsCase } from "@/lib/built-with-skills";
import { editorialEvidenceCopy } from "@/lib/editorial-evidence-copy";
import type { Locale } from "@/lib/locales";
import { EvidenceFeature } from "./evidence-feature";

export function EvidenceArchive({
  cases,
  locale,
  skills,
}: Readonly<{
  cases: readonly BuiltWithSkillsCase[];
  locale: Locale;
  skills: Readonly<Record<string, { readonly slug: string; readonly displayName: string }>>;
}>) {
  const copy = editorialEvidenceCopy[locale];
  const uniqueMethods = new Set(cases.flatMap((item) => item.skills));
  const evidenceCount = cases.reduce((count, item) => count + item.evidence.length, 0);

  return (
    <article className="shell evidence-archive" data-evidence-archive>
      <EditorialPageHero
        className="evidence-archive__hero"
        eyebrow={copy.archiveLabel}
        title={copy.archiveTitle}
        summary={copy.archiveSummary}
        metadata={[
          { label: copy.reportsMetric, value: String(cases.length).padStart(2, "0") },
          { label: copy.sourcesMetric, value: String(evidenceCount).padStart(2, "0") },
          { label: copy.methodsMetric, value: String(uniqueMethods.size).padStart(2, "0") },
        ]}
      />

      <section className="evidence-archive__index" aria-label={copy.archiveLabel}>
        {cases.map((item, index) => (
          <EvidenceFeature
            key={item.slug}
            item={item}
            locale={locale}
            index={index}
            leading={index === 0}
            skills={item.skills.map((slug) => skills[slug]).filter(Boolean)}
            labels={{
              leading: copy.leading,
              report: copy.report,
              methodsApplied: copy.methodsApplied,
              internalEvidence: copy.internalEvidence,
              realUseEvidence: copy.realUseEvidence,
              sourceAvailable: copy.sourceAvailable,
              inspect: copy.inspect,
              evidenceRecord: copy.evidenceRecord,
            }}
          />
        ))}
      </section>
    </article>
  );
}
