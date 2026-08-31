"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { HomeEvidenceThread } from "./home-evidence-thread";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type WorkflowMovement = Readonly<{
  title: string;
  summary: string;
}>;

export type HomeMethodWorkflowProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  movements: readonly WorkflowMovement[];
}>;

function useCompactWorkflowLayout() {
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

export function HomeMethodWorkflow({ eyebrow, title, summary, movements }: HomeMethodWorkflowProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const compactLayout = useCompactWorkflowLayout();
  const staticMode = Boolean(reducedMotion || compactLayout);

  useGSAP(
    () => {
      if (
        staticMode ||
        !rootRef.current ||
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
      ) {
        return;
      }

      const stages = gsap.utils.toArray<HTMLElement>("[data-workflow-stage]", rootRef.current);
      const threadPath = rootRef.current.querySelector<SVGPathElement>(
        '[data-evidence-thread-progress="gsap"]',
      );

      if (stages.length === 0 || !threadPath) return;

      gsap.set(stages, {
        autoAlpha: 0.38,
        y: 24,
        scale: 0.975,
        transformOrigin: "50% 50%",
      });
      gsap.set(stages[0], { autoAlpha: 1, y: 0, scale: 1.02 });
      gsap.set(threadPath, { strokeDasharray: 1, strokeDashoffset: 1 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
          end: "bottom 30%",
          scrub: 0.58,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(threadPath, { strokeDashoffset: 0, duration: movements.length }, 0);

      stages.forEach((stage, index) => {
        const start = index;
        const previous = stages[index - 1];

        if (previous) {
          timeline.to(
            previous,
            {
              autoAlpha: 0.5,
              y: -8,
              scale: 0.99,
              duration: 0.32,
            },
            start,
          );
        }

        timeline.to(
          stage,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1.025,
            duration: 0.4,
          },
          start + 0.05,
        );

        if (index < stages.length - 1) {
          timeline.to(
            stage,
            {
              autoAlpha: 0.58,
              y: -4,
              scale: 1,
              duration: 0.3,
            },
            start + 0.72,
          );
        }
      });
    },
    {
      scope: rootRef,
      dependencies: [staticMode, movements.length],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={rootRef}
      className="home-workflow home-method-workflow"
      data-home-section="workflow"
      data-scroll-choreography={staticMode ? "static" : "scrubbed"}
    >
      <div className="shell">
        <div className="home-editorial-heading home-editorial-heading--wide">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <p>{summary}</p>
        </div>

        <div className="home-method-workflow__field">
          <HomeEvidenceThread
            className="home-method-workflow__thread"
            mode="workflow"
          />

          <ol className="home-workflow-rail">
            {movements.map((movement, index) => (
              <li data-workflow-stage={String(index + 1).padStart(2, "0")} key={movement.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{movement.title}</h3>
                  <p>{movement.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
