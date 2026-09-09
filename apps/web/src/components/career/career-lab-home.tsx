"use client";

import type { Route } from "next";
import Link from "next/link";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { CareerOverview } from "./career-overview";
import { useCareerProfile } from "./career-profile-provider";

const emptyWorkspaceState = {
  en: {
    eyebrow: "05 / Workspace state",
    label: "Your career system",
    currentLabel: "Current step",
    currentBody: "Define your role, market and weekly capacity.",
    stages: [
      { status: "Not started", state: "next" },
      { status: "Waiting for profile", state: "waiting" },
      { status: "Waiting for assessment", state: "waiting" },
      { status: "0 evidence records", state: "empty" },
      { status: "Waiting for target role", state: "waiting" },
    ],
  },
  "pt-BR": {
    eyebrow: "05 / Estado do workspace",
    label: "Seu sistema de carreira",
    currentLabel: "Etapa atual",
    currentBody: "Defina sua função, mercado e capacidade semanal.",
    stages: [
      { status: "Não iniciado", state: "next" },
      { status: "Aguardando perfil", state: "waiting" },
      { status: "Aguardando avaliação", state: "waiting" },
      { status: "0 evidências", state: "empty" },
      { status: "Aguardando função-alvo", state: "waiting" },
    ],
  },
} as const satisfies Record<
  Locale,
  {
    eyebrow: string;
    label: string;
    currentLabel: string;
    currentBody: string;
    stages: ReadonlyArray<{ status: string; state: "next" | "waiting" | "empty" }>;
  }
>;

export function CareerLabHome({ locale }: Readonly<{ locale: Locale }>) {
  const copy = careerLabCopy[locale];
  const entry = copy.entry;
  const workspaceState = emptyWorkspaceState[locale];
  const { profile } = useCareerProfile();

  if (profile) {
    return <CareerOverview locale={locale} />;
  }

  const firstStage = entry.stages[0];

  return (
    <section className="career-lab-entry" aria-labelledby="career-lab-entry-title">
      <div className="career-lab-entry__hero">
        <div className="career-lab-entry__intro">
          <p className="career-lab__eyebrow">{entry.eyebrow}</p>
          <h1 id="career-lab-entry-title">{entry.title}</h1>
          <p className="career-lab-entry__lede">{entry.body}</p>
        </div>

        <dl className="career-lab-entry__dimensions">
          {entry.dimensions.map((dimension) => (
            <div key={dimension.label}>
              <dt>{dimension.label}</dt>
              <dd>{dimension.body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="career-lab-entry__journey" aria-labelledby="career-lab-entry-journey">
        <header className="career-lab-entry__workspace-header">
          <div className="career-lab-entry__workspace-title">
            <p className="career-lab__eyebrow">{workspaceState.eyebrow}</p>
            <h2 id="career-lab-entry-journey">{workspaceState.label}</h2>
          </div>

          {firstStage ? (
            <aside className="career-lab-entry__current" aria-label={workspaceState.currentLabel}>
              <p className="career-lab__eyebrow">{workspaceState.currentLabel}</p>
              <div className="career-lab-entry__current-action">
                <div>
                  <h3>{firstStage.title}</h3>
                  <p>{workspaceState.currentBody}</p>
                </div>
                <Link
                  className="career-lab-entry__primary"
                  href={`/${locale}/career-lab/onboarding` as Route}
                >
                  {entry.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <p className="career-lab-entry__current-note">{entry.localNote}</p>
            </aside>
          ) : null}
        </header>

        <ol aria-label={workspaceState.label}>
          {entry.stages.map((stage, index) => {
            const stageState = workspaceState.stages[index];

            return (
              <li
                key={stage.title}
                data-state={stageState?.state ?? "waiting"}
                aria-current={index === 0 ? "step" : undefined}
              >
                <span className="career-lab-entry__stage-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="career-lab-entry__stage-copy">
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                </div>
                <span className="career-lab-entry__stage-status">{stageState?.status}</span>
              </li>
            );
          })}
        </ol>

        <div className="career-lab-entry__pack">
          <p>{copy.developerCareerPackHint}</p>
          <Link href={`/${locale}/packs/developer-career` as Route}>
            {copy.developerCareerPack}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </section>
  );
}
