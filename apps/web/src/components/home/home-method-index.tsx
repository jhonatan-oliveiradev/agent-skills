"use client";

import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type HomeMethodIndexItem = Readonly<{
  slug: string;
  displayName: string;
  discipline: string;
  category: string;
  outcome: string;
  href: Route;
}>;

export type HomeMethodIndexProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  viewAllLabel: string;
  viewAllHref: Route;
  methods: readonly HomeMethodIndexItem[];
}>;

function useCompactMethodLayout() {
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

export function HomeMethodIndex({ eyebrow, title, summary, viewAllLabel, viewAllHref, methods }: HomeMethodIndexProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const compactLayout = useCompactMethodLayout();
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

      const rows = gsap.utils.toArray<HTMLElement>("[data-method-stage]", rootRef.current);

      rows.forEach((row, index) => {
        const outcome = row.querySelector<HTMLElement>(".home-method-index__outcome");
        const titleNode = row.querySelector<HTMLElement>(".home-method-index__name strong");

        gsap.fromTo(
          row,
          {
            autoAlpha: 0.38,
            y: 46,
            scale: 0.985,
            transformOrigin: "50% 50%",
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 76%",
              end: "center 54%",
              scrub: 0.18,
              invalidateOnRefresh: true,
            },
          },
        );

        if (outcome) {
          gsap.fromTo(
            outcome,
            { autoAlpha: 0.2, y: 14 },
            {
              autoAlpha: 0.9,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top 68%",
                end: "center 48%",
                scrub: 0.16,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (titleNode) {
          gsap.fromTo(
            titleNode,
            { letterSpacing: "-0.045em" },
            {
              letterSpacing: "-0.06em",
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top 72%",
                end: "center 52%",
                scrub: 0.16,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (index < rows.length - 1) {
          gsap.to(row, {
            autoAlpha: 0.62,
            ease: "none",
            scrollTrigger: {
              trigger: rows[index + 1],
              start: "top 62%",
              end: "top 48%",
              scrub: 0.14,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    },
    {
      scope: rootRef,
      dependencies: [staticMode, methods.length],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={rootRef}
      className="home-methods-v2 home-methods-archive"
      data-home-section="methods"
      data-scroll-choreography={staticMode ? "static" : "staggered"}
      data-scroll-timing={staticMode ? "static" : "reading-zone"}
    >
      <div className="shell">
        <div className="home-editorial-heading home-methods-archive__heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div>
            <p>{summary}</p>
            <Link href={viewAllHref}>{viewAllLabel} →</Link>
          </div>
        </div>

        <ol className="home-method-index">
          {methods.map((method, index) => (
            <li data-method-stage={String(index + 1).padStart(2, "0")} key={method.slug}>
              <Link href={method.href}>
                <span className="home-method-index__number">{String(index + 1).padStart(2, "0")}</span>
                <span className="home-method-index__name">
                  <strong>{method.displayName}</strong>
                  <small>{method.discipline}</small>
                  <span className="home-method-index__outcome">{method.outcome}</span>
                </span>
                <span className="home-method-index__meta">{method.category}</span>
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M5 12h13M13 7l5 5-5 5" />
                </svg>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
