import type { Route } from "next";
import Link from "next/link";
import type { AssessmentResultArtifact } from "@/lib/career/assessment";
import { getAssessmentBlueprint } from "@/lib/career/assessment-blueprints";
import { competencyDefinitions } from "@/lib/career/competencies";
import { careerLabCopy } from "@/lib/career/copy";
import { getLearningModuleByCriterion } from "@/lib/career/learning-catalog";
import {
  getAssessmentLearningRecommendation,
  type LearningRecommendation,
} from "@/lib/career/learning-recommendations";
import type { Locale } from "@/lib/locales";

function strengthenCriteria(result: AssessmentResultArtifact) {
  const blueprint = getAssessmentBlueprint(result.blueprintId);
  if (
    !blueprint ||
    blueprint.version !== result.blueprintVersion ||
    blueprint.competencyId !== result.competencyId
  ) {
    return [];
  }

  const definition = competencyDefinitions.find(
    (candidate) => candidate.id === result.competencyId,
  );
  if (!definition) return [];

  const failedChallengeIds = new Set(
    result.dimensions.flatMap((dimension) => dimension.failedChallengeIds),
  );
  const criterionIds = blueprint.challenges
    .filter((challenge) => failedChallengeIds.has(challenge.id))
    .flatMap((challenge) => challenge.criterionIds);

  const seen = new Set<string>();
  return criterionIds.flatMap((criterionId) => {
    if (seen.has(criterionId)) return [];
    seen.add(criterionId);
    const criterion = definition.criteria.find((candidate) => candidate.id === criterionId);
    return criterion ? [criterion] : [];
  });
}

export function AssessmentResult({
  result,
  locale = "en",
  recommendation,
  onReview,
  onRetry,
}: Readonly<{
  result: AssessmentResultArtifact;
  locale?: Locale;
  recommendation?: LearningRecommendation | null;
  onReview?: () => void;
  onRetry?: () => void;
}>) {
  const copy = careerLabCopy[locale].assessment;
  const criteria = strengthenCriteria(result);
  const resolvedRecommendation =
    recommendation === undefined
      ? getAssessmentLearningRecommendation(result)
      : recommendation;
  const studyMapping =
    resolvedRecommendation?.kind === "study"
      ? getLearningModuleByCriterion(resolvedRecommendation.criterionId)
      : undefined;

  return (
    <section className="career-assessment-result" aria-labelledby="assessment-result-title">
      <header className="career-assessment-result__summary">
        <p className="career-lab__eyebrow">{copy.resultEyebrow}</p>
        <h1 id="assessment-result-title">{copy.levelLabel(result.level)}</h1>
        <p>{copy.confidenceLabel(result.confidence)}</p>
      </header>

      <div className="career-assessment-result__grid">
        <section className="career-assessment-result__section">
          <h2>{copy.diagnosis}</h2>
          <p>{copy.diagnosisBody}</p>
        </section>

        <section className="career-assessment-result__section">
          <h2>{copy.demonstrated}</h2>
          {result.strongSignals.length > 0 ? (
            <ul>
              {result.strongSignals.map((signal, index) => (
                <li key={`${index}:${signal}`}>{copy.signal(signal)}</li>
              ))}
            </ul>
          ) : (
            <p>{copy.noDemonstrated}</p>
          )}
        </section>

        <section className="career-assessment-result__section">
          <h2>{copy.strengthenNext}</h2>
          {criteria.length > 0 ? (
            <ul>
              {criteria.map((criterion) => (
                <li key={criterion.id}>{criterion.description}</li>
              ))}
            </ul>
          ) : (
            <p>{copy.noStrengthen}</p>
          )}
        </section>

        <section
          className="career-assessment-result__section career-assessment-result__section--next"
          aria-label={copy.yourNextStep}
        >
          <h2>{copy.yourNextStep}</h2>
          {resolvedRecommendation?.kind === "study" ? (
            <>
              <p>
                {studyMapping?.module.title[locale] ?? copy.signal(result.recommendedNextEvidence)}
              </p>
              <Link
                className="career-assessment-result__primary-action"
                href={`/${locale}/career-lab/learning/${resolvedRecommendation.noteId}#${resolvedRecommendation.moduleId}` as Route}
              >
                {copy.studyNow}
              </Link>
            </>
          ) : resolvedRecommendation?.kind === "prove" ? (
            <>
              <p>{copy.signal(result.recommendedNextEvidence)}</p>
              <Link
                className="career-assessment-result__primary-action"
                href={
                  `/${locale}/career-lab/${resolvedRecommendation.destination === "assessment" ? "assessments" : "evidence"}` as Route
                }
              >
                {resolvedRecommendation.destination === "assessment"
                  ? copy.proveAssessment
                  : copy.proveEvidence}
              </Link>
            </>
          ) : (
            <>
              <p>{copy.noCuratedStudy}</p>
              <p>{copy.signal(result.recommendedNextEvidence)}</p>
            </>
          )}
        </section>

        <section className="career-assessment-result__section career-assessment-result__actions">
          <h2>{copy.actions}</h2>
          <div>
            {onReview ? (
              <button type="button" onClick={onReview}>
                {copy.reviewChallenges}
              </button>
            ) : null}
            {onRetry ? (
              <button type="button" onClick={onRetry}>
                {copy.tryAgain}
              </button>
            ) : null}
            <Link href={`/${locale}/career-lab/assessments` as Route}>
              {copy.backToAssessments}
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
