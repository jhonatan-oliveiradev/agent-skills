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

      const root = rootRef.current;
      const field = root.querySelector<HTMLElement>(".home-method-workflow__field");
      const stages = gsap.utils.toArray<HTMLElement>("[data-workflow-stage]", root);
      const threadPath = root.querySelector<SVGPathElement>(
        '[data-evidence-thread-progress="gsap"]',
      );

      if (!field || stages.length === 0 || !threadPath) return;

      const setActiveStage = (progress: number) => {
        const activeIndex = Math.min(
          stages.length - 1,
          Math.floor(Math.max(0, Math.min(0.9999, progress)) * stages.length),
        );

        root.dataset.workflowActive = String(activeIndex + 1).padStart(2, "0");
        stages.forEach((stage, index) => {
          stage.dataset.active = index === activeIndex ? "true" : "false";
        });
      };

      gsap.set(stages, {
        autoAlpha: 0.44,
        y: 16,
        scale: 0.99,
        transformOrigin: "50% 50%",
      });
      gsap.set(stages[0], { autoAlpha: 1, y: 0, scale: 1.012 });
      gsap.set(threadPath, { strokeDasharray: 1, strokeDashoffset: 1 });
      setActiveStage(0);

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: field,
          start: "top 74%",
          end: "bottom 38%",
          scrub: 0.16,
          invalidateOnRefresh: true,
          onRefresh: (self) => setActiveStage(self.progress),
          onUpdate: (self) => setActiveStage(self.progress),
        },
      });

      timeline.to(threadPath, { strokeDashoffset: 0, duration: 1 }, 0);

      stages.forEach((stage, index) => {
        const position = index / stages.length;

        if (index > 0) {
          timeline.to(
            stages[index - 1],
            { autoAlpha: 0.5, y: -4, scale: 0.995, duration: 0.1 },
            position,
          );
          timeline.to(
            stage,
            { autoAlpha: 1, y: 0, scale: 1.012, duration: 0.12 },
            position,
          );
        }
      });

      return () => {
        delete root.dataset.workflowActive;
        stages.forEach((stage) => delete stage.dataset.active);
      };
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
      data-scroll-timing={staticMode ? "static" : "section-timeline"}
    >
      <div className="shell">
        <div className="home-editorial-heading home-editorial-heading--wide">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <p>{summary}</p>
        </div>

        <div
          className="home-method-workflow__field"
          data-workflow-track={staticMode ? "static" : "single-timeline"}
        >
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
