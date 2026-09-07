import type { AssessmentResultArtifact } from "@/lib/career/assessment";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";

export function AssessmentResult({
  result,
  locale = "en",
}: Readonly<{ result: AssessmentResultArtifact; locale?: Locale }>) {
  const copy = careerLabCopy[locale].assessment;

  return (
    <section className="career-assessment-result" aria-labelledby="assessment-result-title">
      <p className="career-lab__eyebrow">{copy.resultEyebrow}</p>
      <h1 id="assessment-result-title">{copy.levelLabel(result.level)}</h1>
      <p>{copy.confidenceLabel(result.confidence)}</p>

      <section>
        <h2>{copy.strongSignals}</h2>
        {result.strongSignals.length > 0 ? (
          <ul>
            {result.strongSignals.map((signal, index) => (
              <li key={`${index}:${signal}`}>{copy.signal(signal)}</li>
            ))}
          </ul>
        ) : <p>{copy.noStrongSignals}</p>}
      </section>

      <section>
        <h2>{copy.weakSignals}</h2>
        {result.weakSignals.length > 0 ? (
          <ul>
            {result.weakSignals.map((signal, index) => (
              <li key={`${index}:${signal}`}>{copy.signal(signal)}</li>
            ))}
          </ul>
        ) : <p>{copy.noWeakSignals}</p>}
      </section>

      <section>
        <h2>{copy.nextEvidence}</h2>
        <p>{copy.signal(result.recommendedNextEvidence)}</p>
      </section>
    </section>
  );
}
