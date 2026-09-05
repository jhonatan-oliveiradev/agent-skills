import type { AssessmentResultArtifact } from "@/lib/career/assessment";

export function AssessmentResult({
  result,
}: Readonly<{ result: AssessmentResultArtifact }>) {
  return (
    <section className="career-assessment-result" aria-labelledby="assessment-result-title">
      <p className="career-lab__eyebrow">Proficiency report</p>
      <h1 id="assessment-result-title">{result.level}</h1>
      <p>{result.confidence} confidence</p>

      <section>
        <h2>Strong signals</h2>
        {result.strongSignals.length > 0 ? (
          <ul>{result.strongSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
        ) : <p>No strong signals recorded yet.</p>}
      </section>

      <section>
        <h2>Weak signals</h2>
        {result.weakSignals.length > 0 ? (
          <ul>{result.weakSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
        ) : <p>No weak signals recorded.</p>}
      </section>

      <section>
        <h2>Next evidence</h2>
        <p>{result.recommendedNextEvidence}</p>
      </section>
    </section>
  );
}
