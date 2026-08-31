"use client";

import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type HomePackDossierItem = Readonly<{
  slug: string;
  name: string;
  summary: string;
  version: string;
  status: "active" | "planned";
  skillCount: number;
  outcomes: readonly string[];
  representativeSkills: readonly string[];
  href: Route;
}>;

export type HomePackDossiersProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  skillsTemplate: string;
  viewLabel: string;
  viewAllLabel: string;
  viewAllHref: Route;
  packs: readonly HomePackDossierItem[];
}>;

function useCompactPackLayout() {
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

export function HomePackDossiers({
  eyebrow,
  title,
  summary,
  skillsTemplate,
  viewLabel,
  viewAllLabel,
  viewAllHref,
  packs,
}: HomePackDossiersProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const compactLayout = useCompactPackLayout();
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

      const dossiers = gsap.utils.toArray<HTMLElement>("[data-pack-stage]", rootRef.current);

      dossiers.forEach((dossier, index) => {
        const evidence = dossier.querySelector<HTMLElement>(".home-pack-dossier__evidence");
        const heading = dossier.querySelector<HTMLElement>("h3");
        const xStart = index % 2 === 0 ? -28 : 28;

        gsap.fromTo(
          dossier,
          {
            autoAlpha: 0.48,
            x: xStart,
            y: 68,
            scale: 0.965,
            transformOrigin: "50% 50%",
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: dossier,
              start: "top 90%",
              end: "center 54%",
              scrub: 0.62,
              invalidateOnRefresh: true,
            },
          },
        );

        if (evidence) {
          gsap.fromTo(
            evidence,
            { autoAlpha: 0.18, x: 20 },
            {
              autoAlpha: 1,
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: dossier,
                start: "top 72%",
                end: "center 48%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (heading) {
          gsap.fromTo(
            heading,
            { y: 12 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: dossier,
                start: "top 78%",
                end: "center 52%",
                scrub: 0.45,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });
    },
    {
      scope: rootRef,
      dependencies: [staticMode, packs.length],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={rootRef}
      className="home-packs-v2 home-pack-archive"
      data-home-section="packs"
      data-scroll-choreography={staticMode ? "static" : "staged"}
    >
      <div className="shell">
        <div className="home-editorial-heading home-pack-archive__heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div>
            <p>{summary}</p>
            <Link href={viewAllHref}>{viewAllLabel} →</Link>
          </div>
        </div>

        <div className="home-pack-dossiers">
          {packs.map((pack, index) => (
            <article
              className="home-pack-dossier"
              data-pack-index={String(index + 1).padStart(2, "0")}
              data-pack-stage={String(index + 1).padStart(2, "0")}
              key={pack.slug}
            >
              <div className="home-pack-dossier__meta">
                <span>{skillsTemplate.replace("{count}", String(pack.skillCount))}</span>
                <span>{pack.status}</span>
                <span>{pack.version}</span>
              </div>

              <div className="home-pack-dossier__body">
                <div>
                  <h3>{pack.name}</h3>
                  <p>{pack.summary}</p>
                </div>

                <div className="home-pack-dossier__evidence">
                  <ul className="home-pack-dossier__outcomes">
                    {pack.outcomes.slice(0, 2).map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>

                  <ul className="home-pack-dossier__skills" aria-label={`${pack.name} skills`}>
                    {pack.representativeSkills.slice(0, 3).map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link className="home-pack-dossier__link" href={pack.href}>
                {viewLabel} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
