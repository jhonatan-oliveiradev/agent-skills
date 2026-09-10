"use client";

import { careerGuidanceCopy } from "@/lib/career/guidance-copy";
import type { Locale } from "@/lib/locales";
import { useOptionalCareerGuidance } from "./career-guidance-provider";

export function CareerGuide({ locale }: Readonly<{ locale: Locale }>) {
  const copy = careerGuidanceCopy[locale].guide;
  const guidance = useOptionalCareerGuidance();

  return (
    <article className="career-guide" aria-labelledby="career-guide-title">
      <header className="career-guide__hero">
        <p className="career-lab__eyebrow">{copy.eyebrow}</p>
        <h1 id="career-guide-title">{copy.title}</h1>
        <p>{copy.intro}</p>
      </header>

      <section className="career-guide__start" aria-labelledby="career-guide-start-title">
        <header>
          <p className="career-lab__eyebrow">01 / 05</p>
          <h2 id="career-guide-start-title">{copy.startHereTitle}</h2>
        </header>

        <ol className="career-guide__loop">
          {copy.stages.map((stage, index) => (
            <li
              className="career-guide__area"
              data-testid="career-guide-area"
              key={stage.id}
            >
              <span className="career-guide__area-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="career-guide__area-heading">
                <h3>{stage.title}</h3>
              </div>
              <dl>
                <div>
                  <dt>{copy.labels.purpose}</dt>
                  <dd>{stage.purpose}</dd>
                </div>
                <div>
                  <dt>{copy.labels.when}</dt>
                  <dd>{stage.when}</dd>
                </div>
                <div>
                  <dt>{copy.labels.done}</dt>
                  <dd>{stage.done}</dd>
                </div>
                <div>
                  <dt>{copy.labels.after}</dt>
                  <dd>{stage.after}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      <section className="career-guide__qa" aria-labelledby="career-guide-qa-title">
        <header>
          <p className="career-lab__eyebrow">Q / A</p>
          <h2 id="career-guide-qa-title">{copy.qaTitle}</h2>
        </header>
        <div className="career-guide__questions">
          {copy.questions.map((item, index) => (
            <details data-testid="career-guide-question" key={item.id}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.question}
              </summary>
              <div className="career-guide__answer">
                <div className="career-guide__answer-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="career-guide__restart" aria-labelledby="career-guide-restart-title">
        <p className="career-lab__eyebrow">↺ / Orientation</p>
        <h2 id="career-guide-restart-title">{copy.restartTitle}</h2>
        <p>{copy.restartBody}</p>
        <button
          className="career-guide__restart-action"
          type="button"
          onClick={guidance?.openOrientation}
          disabled={!guidance}
        >
          {copy.restartAction}
        </button>
      </section>
    </article>
  );
}
