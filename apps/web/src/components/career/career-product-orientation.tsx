"use client";

import { useEffect, useRef } from "react";
import { careerGuidanceCopy } from "@/lib/career/guidance-copy";
import type { Locale } from "@/lib/locales";
import { useOptionalCareerGuidance } from "./career-guidance-provider";

export function CareerProductOrientation({ locale }: Readonly<{ locale: Locale }>) {
  const guidance = useOptionalCareerGuidance();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const copy = careerGuidanceCopy[locale].orientation;
  const isOpen = guidance?.isOrientationOpen ?? false;

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    headingRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !guidance) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") guidance?.closeOrientation();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [guidance, isOpen]);

  if (!guidance || !isOpen) return null;

  return (
    <div className="career-orientation__backdrop">
      <section
        className="career-orientation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-orientation-title"
        aria-describedby="career-orientation-intro"
      >
        <header className="career-orientation__header">
          <div>
            <p className="career-lab__eyebrow">{copy.eyebrow}</p>
            <h2 id="career-orientation-title" ref={headingRef} tabIndex={-1}>
              {copy.title}
            </h2>
          </div>
          <button
            className="career-orientation__close"
            type="button"
            onClick={guidance.closeOrientation}
          >
            {copy.close}
          </button>
        </header>

        <p id="career-orientation-intro" className="career-orientation__intro">
          {copy.intro}
        </p>

        <ol className="career-orientation__stages">
          {copy.stages.map((stage, index) => (
            <li data-testid="career-orientation-stage" key={stage.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <footer className="career-orientation__actions">
          <button type="button" onClick={() => void guidance.skipOrientation()}>
            {copy.skip}
          </button>
          <button
            className="career-orientation__complete"
            type="button"
            onClick={() => void guidance.completeOrientation()}
          >
            {copy.complete}
          </button>
        </footer>
      </section>
    </div>
  );
}
