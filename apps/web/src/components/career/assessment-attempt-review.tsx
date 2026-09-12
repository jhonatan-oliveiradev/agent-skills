import type {
  AssessmentResponses,
  PublicAssessmentBlueprint,
} from "@/lib/career/assessment";
import type { AssessmentLearningFeedback } from "@/lib/career/assessment-learning-feedback";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";

function isCorrectSelection(
  kind: PublicAssessmentBlueprint["challenges"][number]["kind"],
  selected: readonly string[],
  correct: readonly string[],
): boolean {
  if (kind === "structured-ordering") {
    return (
      selected.length === correct.length &&
      selected.every((id, index) => id === correct[index])
    );
  }

  if (selected.length !== correct.length) return false;
  const selectedSet = new Set(selected);
  return correct.every((id) => selectedSet.has(id));
}

function labelsFor(
  challenge: PublicAssessmentBlueprint["challenges"][number],
  ids: readonly string[],
): readonly string[] {
  return ids.map(
    (id) => challenge.options.find((option) => option.id === id)?.label ?? id,
  );
}

export function AssessmentAttemptReview({
  blueprint,
  responses,
  learningFeedback,
  locale,
  onBack,
}: Readonly<{
  blueprint: PublicAssessmentBlueprint;
  responses: AssessmentResponses;
  learningFeedback: readonly AssessmentLearningFeedback[];
  locale: Locale;
  onBack: () => void;
}>) {
  const copy = careerLabCopy[locale].assessment;

  return (
    <section className="career-assessment-review" aria-labelledby="assessment-review-title">
      <header className="career-assessment-review__header">
        <p className="career-lab__eyebrow">{copy.reviewChallenges}</p>
        <h1 id="assessment-review-title">{copy.reviewChallenges}</h1>
      </header>

      <div className="career-assessment-review__challenges">
        {blueprint.challenges.map((challenge, index) => {
          const selectedIds = responses.answers[challenge.id] ?? [];
          const feedback = learningFeedback.find(
            (candidate) => candidate.challengeId === challenge.id,
          );
          const correctIds = feedback?.correctOptionIds ?? [];
          const correct = feedback
            ? isCorrectSelection(challenge.kind, selectedIds, correctIds)
            : false;
          const selectedLabels = labelsFor(challenge, selectedIds);
          const correctLabels = labelsFor(challenge, correctIds);

          return (
            <article className="career-assessment-review__challenge" key={challenge.id}>
              <header>
                <p>{index + 1}</p>
                <h2>{challenge.prompt}</h2>
                {feedback ? (
                  <p
                    className="career-assessment-review__status"
                    data-correct={correct}
                  >
                    {correct ? copy.reviewCorrect : copy.reviewIncorrect}
                  </p>
                ) : null}
              </header>

              <div className="career-assessment-review__response">
                <h3>{copy.reviewSelected}</h3>
                {selectedLabels.length > 0 ? (
                  <ol>
                    {selectedLabels.map((label, answerIndex) => (
                      <li key={`${answerIndex}:${label}`}>{label}</li>
                    ))}
                  </ol>
                ) : (
                  <p>—</p>
                )}
              </div>

              {feedback ? (
                <>
                  <div className="career-assessment-review__response">
                    <h3>{copy.reviewExpected}</h3>
                    <ol>
                      {correctLabels.map((label, answerIndex) => (
                        <li key={`${answerIndex}:${label}`}>{label}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="career-assessment-review__explanation">
                    <h3>{copy.reviewExplanation}</h3>
                    <p>{feedback.rationale}</p>
                    {feedback.codeExample ? (
                      <pre data-language={feedback.codeExample.language}>
                        <code>{feedback.codeExample.code}</code>
                      </pre>
                    ) : null}
                  </div>

                  <div className="career-assessment-review__option-notes">
                    <h3>{copy.reviewOptionNotes}</h3>
                    <ul>
                      {challenge.options.map((option) => (
                        <li key={option.id}>
                          <strong>{option.label}:</strong>{" "}
                          {feedback.optionExplanations[option.id]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}
            </article>
          );
        })}
      </div>

      <footer className="career-assessment-review__actions">
        <button type="button" onClick={onBack}>
          {copy.backToResult}
        </button>
      </footer>
    </section>
  );
}
