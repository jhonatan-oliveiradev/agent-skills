"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import type { HomeCaseStage } from "@/lib/home-evidence-content";
import { HomeEvidenceThread } from "./home-evidence-thread";

export type HomeCaseEvidenceLink = Readonly<{
  label: string;
  href: string;
  external?: boolean;
}>;

export type HomeCaseStudyStoryProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  stages: readonly HomeCaseStage[];
  evidenceLinks: readonly HomeCaseEvidenceLink[];
}>;

function useCompactCaseLayout() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return compact;
}

export function HomeCaseStudyStory({
  eyebrow,
  title,
  summary,
  stages,
  evidenceLinks,
}: HomeCaseStudyStoryProps) {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const compactLayout = useCompactCaseLayout();
  const linearMode = Boolean(reducedMotion || compactLayout);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    damping: 32,
    stiffness: 150,
    mass: 0.28,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (linearMode) return;
    const next = Math.min(stages.length - 1, Math.max(0, Math.floor(latest * stages.length)));
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActiveIndex(next);
    }
  });

  const activeStage = stages[activeIndex] ?? stages[0];

  return (
    <section
      ref={rootRef}
      className="home-case-story"
      data-case-mode={linearMode ? "linear" : "sticky"}
      data-home-section="case-study"
    >
      <div className="shell home-case-story__intro">
        <p className="eyebrow">{eyebrow}</p>
        <div>
          <h2>{title}</h2>
          <p>{summary}</p>
        </div>
      </div>

      <div
        className="home-case-story__stage"
        data-case-sticky={linearMode ? undefined : "true"}
      >
        <div className="shell home-case-story__stage-grid">
          <HomeEvidenceThread
            className="absolute inset-y-0 left-[48%] hidden w-[20%] opacity-55 md:block"
            mode="case"
            progress={progress}
          />

          <div className="home-case-story__artifact-wrap" aria-hidden="true">
            <div
              className="home-case-story__artifact"
              data-active-case-stage={activeStage?.id}
            >
              <div className="home-case-story__browser-bar"><i /><i /><i /></div>
              <div className="home-case-story__artifact-grid">
                <div className="home-case-story__artifact-copy">
                  <b />
                  <strong />
                  <strong />
                  <strong />
                  <span />
                </div>
                <aside>
                  <span />
                  <span />
                  <span />
                  <em />
                </aside>
              </div>
              <div className="home-case-story__veil" />
              <div className="home-case-story__scanline" />
            </div>
          </div>

          <ol className="home-case-story__rail">
            {stages.map((stage, index) => {
              const active = linearMode || index === activeIndex;
              return (
                <li
                  key={stage.id}
                  data-case-stage={stage.id}
                  data-active={active ? "true" : "false"}
                >
                  <span>{stage.eyebrow}</span>
                  <div>
                    <h3>{stage.title}</h3>
                    <p>{stage.summary}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="shell home-case-story__evidence">
        <span>Evidence</span>
        <div>
          {evidenceLinks.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              rel={item.external ? "noreferrer noopener" : undefined}
              target={item.external ? "_blank" : undefined}
            >
              {item.label}{item.external ? " ↗" : " →"}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
