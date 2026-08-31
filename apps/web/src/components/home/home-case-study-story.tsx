"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import type { HomeCaseStage } from "@/lib/home-evidence-content";
import { HomeEvidenceThread } from "./home-evidence-thread";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const compactLayout = useCompactCaseLayout();
  const linearMode = Boolean(reducedMotion || compactLayout);

  useGSAP(
    () => {
      if (
        linearMode ||
        !rootRef.current ||
        !stageRef.current ||
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
      ) {
        return;
      }

      const artifact = rootRef.current.querySelector<HTMLElement>("[data-case-artifact]");
      const grid = rootRef.current.querySelector<HTMLElement>(".home-case-story__artifact-grid");
      const aside = rootRef.current.querySelector<HTMLElement>(".home-case-story__artifact-grid aside");
      const veil = rootRef.current.querySelector<HTMLElement>(".home-case-story__veil");
      const scanline = rootRef.current.querySelector<HTMLElement>(".home-case-story__scanline");
      const copyLines = gsap.utils.toArray<HTMLElement>(".home-case-story__artifact-copy strong", rootRef.current);
      const checkpoints = gsap.utils.toArray<HTMLElement>("[data-case-checkpoint]", rootRef.current);
      const threadPath = rootRef.current.querySelector<SVGPathElement>(
        '[data-evidence-thread-progress="gsap"]',
      );

      if (!artifact || !grid || !aside || !veil || !scanline || checkpoints.length === 0) {
        return;
      }

      gsap.set(artifact, { transformOrigin: "50% 50%" });
      gsap.set(grid, { xPercent: -2, scale: 0.94, transformOrigin: "50% 50%" });
      gsap.set(aside, { xPercent: -8 });
      gsap.set(copyLines, { scaleX: 0.78, transformOrigin: "left center", opacity: 0.7 });
      gsap.set(veil, { autoAlpha: 0, xPercent: 14, yPercent: -8, rotation: -7, scale: 0.92 });
      gsap.set(scanline, { autoAlpha: 0, yPercent: -65 });
      gsap.set(checkpoints, { autoAlpha: 0, y: 24, pointerEvents: "none" });
      gsap.set(checkpoints[0], { autoAlpha: 1, y: 0, pointerEvents: "auto" });
      if (threadPath) gsap.set(threadPath, { strokeDasharray: 1, strokeDashoffset: 1 });

      const setActiveCheckpoint = (progress: number) => {
        const next = Math.min(stages.length - 1, Math.max(0, Math.floor(progress * stages.length)));
        if (next === activeRef.current) return;
        activeRef.current = next;
        setActiveIndex(next);
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top+=72",
          end: () => `+=${Math.max(window.innerHeight * 3.4, 2400)}`,
          scrub: 0.65,
          pin: stageRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActiveCheckpoint(self.progress),
        },
      });

      timeline
        .addLabel("problem", 0)
        .to(
          grid,
          {
            xPercent: 0,
            scale: 0.985,
            duration: 1,
          },
          0,
        )
        .to(
          aside,
          {
            xPercent: 0,
            duration: 1,
          },
          0,
        )
        .to(
          copyLines,
          {
            scaleX: 0.93,
            opacity: 0.88,
            stagger: 0.035,
            duration: 0.9,
          },
          0.05,
        )
        .to(scanline, { autoAlpha: 0.72, yPercent: 8, duration: 0.8 }, 0.15)
        .to(threadPath, { strokeDashoffset: 0.68, duration: 1 }, 0)
        .to(checkpoints[0], { autoAlpha: 0, y: -18, pointerEvents: "none", duration: 0.18 }, 0.78)
        .to(checkpoints[1], { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.2 }, 0.82)
        .addLabel("method", 1)
        .to(
          artifact,
          {
            scale: 1.012,
            duration: 1,
          },
          1,
        )
        .to(
          copyLines,
          {
            scaleX: 1,
            opacity: 1,
            stagger: 0.03,
            duration: 0.8,
          },
          1,
        )
        .to(scanline, { autoAlpha: 0.9, yPercent: 72, duration: 0.9 }, 1)
        .to(threadPath, { strokeDashoffset: 0.38, duration: 1 }, 1)
        .to(checkpoints[1], { autoAlpha: 0, y: -18, pointerEvents: "none", duration: 0.18 }, 1.78)
        .to(checkpoints[2], { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.2 }, 1.82)
        .addLabel("transformation", 2)
        .to(
          veil,
          {
            autoAlpha: 0.94,
            xPercent: 0,
            yPercent: 0,
            rotation: -7,
            scale: 1.06,
            duration: 1,
          },
          2,
        )
        .to(
          grid,
          {
            xPercent: 1.2,
            scale: 1.012,
            duration: 1,
          },
          2,
        )
        .to(scanline, { autoAlpha: 0.35, yPercent: 135, duration: 0.85 }, 2)
        .to(threadPath, { strokeDashoffset: 0.12, duration: 1 }, 2)
        .to(checkpoints[2], { autoAlpha: 0, y: -18, pointerEvents: "none", duration: 0.18 }, 2.78)
        .to(checkpoints[3], { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.2 }, 2.82)
        .addLabel("evidence", 3)
        .to(
          artifact,
          {
            scale: 1.025,
            duration: 0.8,
          },
          3,
        )
        .to(
          aside,
          {
            xPercent: 2,
            borderColor: "rgba(167, 139, 250, 0.46)",
            duration: 0.8,
          },
          3,
        )
        .to(scanline, { autoAlpha: 0, duration: 0.45 }, 3)
        .to(threadPath, { strokeDashoffset: 0, duration: 0.8 }, 3);
    },
    {
      scope: rootRef,
      dependencies: [linearMode, stages.length],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={rootRef}
      className="home-case-story"
      data-case-mode={linearMode ? "linear" : "sticky"}
      data-home-section="case-study"
      data-scroll-choreography={linearMode ? "static" : "scrubbed"}
    >
      <div className="shell home-case-story__intro">
        <p className="eyebrow">{eyebrow}</p>
        <div>
          <h2>{title}</h2>
          <p>{summary}</p>
        </div>
      </div>

      <div
        ref={stageRef}
        className="home-case-story__stage"
        data-case-sticky={linearMode ? undefined : "true"}
      >
        <div className="shell home-case-story__stage-grid">
          <HomeEvidenceThread
            className="absolute inset-y-0 left-[48%] hidden w-[20%] opacity-55 md:block"
            mode="case"
          />

          <div className="home-case-story__artifact-wrap" aria-hidden="true">
            <div
              className="home-case-story__artifact"
              data-active-case-stage={linearMode ? "evidence" : undefined}
              data-case-artifact="true"
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

          <ol className="home-case-story__rail" aria-live="off">
            {stages.map((stage, index) => {
              const active = linearMode || index === activeIndex;
              return (
                <li
                  key={stage.id}
                  aria-current={!linearMode && active ? "step" : undefined}
                  data-active={active ? "true" : "false"}
                  data-case-checkpoint={String(index + 1).padStart(2, "0")}
                  data-case-stage={stage.id}
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
