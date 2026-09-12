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

const resultV2Copy = {
  en: {
    diagnosis: "Diagnosis",
    diagnosisBody:
      "This deterministic result reflects the strongest level supported by the completed challenge signals.",
    demonstrated: "Demonstrated",
    noDemonstrated: "No strong demonstrated signals were recorded in this attempt.",
    strengthenNext: "Strengthen next",
    noStrengthen:
      "No failed criterion could be mapped from this attempt. Use the next evidence recommendation below.",
    yourNextStep: "Your next step",
    noCuratedStudy:
      "No curated study module is available for this result yet. Use the next evidence recommendation as the continuation path.",
    studyNow: "Study now",
    proveAssessment: "Prove with assessment",
    proveEvidence: "Add evidence",
    actions: "Actions",
    reviewChallenges: "Review challenges",
    tryAgain: "Try again",
    backToAssessments: "Back to assessments",
  },
  "pt-BR": {
    diagnosis: "Diagnóstico",
    diagnosisBody:
      "Este resultado determinístico reflete o nível mais alto sustentado pelos sinais observados nos desafios concluídos.",
    demonstrated: "Demonstrado",
    noDemonstrated: "Nenhum sinal forte demonstrado foi registrado nesta tentativa.",
    strengthenNext: "Fortalecer agora",
    noStrengthen:
      "Nenhum critério reprovado pôde ser mapeado nesta tentativa. Use a recomendação de próxima evidência abaixo.",
    yourNextStep: "Seu próximo passo",
    noCuratedStudy:
      "Ainda não há um módulo de estudo revisado para este resultado. Use a recomendação de próxima evidência como continuação.",
    studyNow: "Estudar agora",
    proveAssessment: "Comprovar com avaliação",
    proveEvidence: "Adicionar evidência",
    actions: "Ações",
    reviewChallenges: "Revisar desafios",
    tryAgain: "Tentar novamente",
    backToAssessments: "Voltar para avaliações",
  },
} as const;

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
  const v2 = resultV2Copy[locale];
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
          <h2>{v2.diagnosis}</h2>
          <p>{v2.diagnosisBody}</p>
        </section>

        <section className="career-assessment-result__section">
          <h2>{v2.demonstrated}</h2>
          {result.strongSignals.length > 0 ? (
            <ul>
              {result.strongSignals.map((signal, index) => (
                <li key={`${index}:${signal}`}>{copy.signal(signal)}</li>
              ))}
            </ul>
          ) : (
            <p>{v2.noDemonstrated}</p>
          )}
        </section>

        <section className="career-assessment-result__section">
          <h2>{v2.strengthenNext}</h2>
          {criteria.length > 0 ? (
            <ul>
              {criteria.map((criterion) => (
                <li key={criterion.id}>{criterion.description}</li>
              ))}
            </ul>
          ) : (
            <p>{v2.noStrengthen}</p>
          )}
        </section>

        <section
          className="career-assessment-result__section career-assessment-result__section--next"
          aria-label={v2.yourNextStep}
        >
          <h2>{v2.yourNextStep}</h2>
          {resolvedRecommendation?.kind === "study" ? (
            <>
              <p>
                {studyMapping?.module.title[locale] ?? copy.signal(result.recommendedNextEvidence)}
              </p>
              <Link
                className="career-assessment-result__primary-action"
                href={`/${locale}/career-lab/learning/${resolvedRecommendation.noteId}#${resolvedRecommendation.moduleId}` as Route}
              >
                {v2.studyNow}
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
                  ? v2.proveAssessment
                  : v2.proveEvidence}
              </Link>
            </>
          ) : (
            <>
              <p>{v2.noCuratedStudy}</p>
              <p>{copy.signal(result.recommendedNextEvidence)}</p>
            </>
          )}
        </section>

        <section className="career-assessment-result__section career-assessment-result__actions">
          <h2>{v2.actions}</h2>
          <div>
            {onReview ? (
              <button type="button" onClick={onReview}>
                {v2.reviewChallenges}
              </button>
            ) : null}
            {onRetry ? (
              <button type="button" onClick={onRetry}>
                {v2.tryAgain}
              </button>
            ) : null}
            <Link href={`/${locale}/career-lab/assessments` as Route}>
              {v2.backToAssessments}
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
