"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { careerLabCopy, careerLabRoleLabels } from "@/lib/career/copy";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import { getRoleMap } from "@/lib/career/role-maps";
import type { CareerProfile, TargetRoleId } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";

type RoleChoice = TargetRoleId | "undecided";

interface CareerOnboardingProps {
  readonly locale: Locale;
  readonly onComplete: (profile: CareerProfile) => void | Promise<void>;
}

const roleIds = [
  "frontend-developer",
  "backend-developer",
  "fullstack-developer",
] as const satisfies readonly TargetRoleId[];

export function CareerOnboarding({ locale, onComplete }: CareerOnboardingProps) {
  const copy = careerLabCopy[locale].onboarding;
  const [step, setStep] = useState(0);
  const [context, setContext] = useState("");
  const [role, setRole] = useState<RoleChoice>("undecided");
  const [market, setMarket] = useState("br");
  const [weeklyHours, setWeeklyHours] = useState("8");

  const canContinue =
    step === 0
      ? context.trim().length > 0
      : step === 1
        ? role !== "undecided"
        : step === 2
          ? market.trim().length > 0 && Number(weeklyHours) > 0
          : true;

  function createProfile() {
    if (role === "undecided") return;
    const base = createEmptyCareerProfile({
      targetRole: role,
      targetMarket: market,
      weeklyStudyHours: Number(weeklyHours),
    });
    const competencyIds = [...new Set(getRoleMap(role).requirements.map(({ competencyId }) => competencyId))];
    const profile: CareerProfile = {
      ...base,
      competencies: competencyIds.map((competencyId) => ({
        competencyId,
        level: null,
        confidence: "low" as const,
        evidenceIds: [],
        lastAssessedAt: null,
      })),
    };
    void onComplete(profile);
  }

  return (
    <section className="career-onboarding" aria-labelledby="career-onboarding-title">
      <header>
        <p className="career-lab__eyebrow">0{step + 1} / 04</p>
        <h1 id="career-onboarding-title">{copy.title}</h1>
      </header>

      {step === 0 ? (
        <div className="career-onboarding__step">
          <h2>{copy.contextTitle}</h2>
          <label htmlFor="career-context">{copy.contextLabel}</label>
          <textarea
            id="career-context"
            value={context}
            rows={6}
            onChange={(event) => setContext(event.target.value)}
            aria-describedby="career-context-hint"
          />
          <p id="career-context-hint">{copy.contextHint}</p>
        </div>
      ) : null}

      {step === 1 ? (
        <fieldset className="career-onboarding__step career-onboarding__roles">
          <legend>{copy.roleTitle}</legend>
          {roleIds.map((roleId) => (
            <label key={roleId}>
              <input
                type="radio"
                name="career-role"
                value={roleId}
                checked={role === roleId}
                onChange={() => setRole(roleId)}
              />
              <span>{careerLabRoleLabels[locale][roleId]}</span>
            </label>
          ))}
          <label>
            <input
              type="radio"
              name="career-role"
              value="undecided"
              checked={role === "undecided"}
              onChange={() => setRole("undecided")}
            />
            <span>{copy.undecided}</span>
          </label>
          {role === "undecided" ? <p>{copy.undecidedHint}</p> : null}
        </fieldset>
      ) : null}

      {step === 2 ? (
        <div className="career-onboarding__step">
          <h2>{copy.marketTitle}</h2>
          <label htmlFor="career-market">{copy.marketLabel}</label>
          <select id="career-market" value={market} onChange={(event) => setMarket(event.target.value)}>
            {Object.entries(copy.markets).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <label htmlFor="career-weekly-hours">{copy.weeklyHoursLabel}</label>
          <input
            id="career-weekly-hours"
            type="number"
            min="1"
            max="80"
            value={weeklyHours}
            onChange={(event) => setWeeklyHours(event.target.value)}
          />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="career-onboarding__step career-onboarding__review">
          <h2>{copy.reviewTitle}</h2>
          <p>{copy.reviewBody}</p>
          {role !== "undecided" ? (
            <dl>
              <div><dt>{copy.roleTitle}</dt><dd>{careerLabRoleLabels[locale][role]}</dd></div>
              <div><dt>{copy.marketLabel}</dt><dd>{copy.markets[market as keyof typeof copy.markets] ?? market}</dd></div>
              <div><dt>{copy.weeklyHoursLabel}</dt><dd>{weeklyHours}</dd></div>
            </dl>
          ) : null}
        </div>
      ) : null}

      <footer className="career-onboarding__actions">
        {step > 0 ? <button type="button" onClick={() => setStep((value) => value - 1)}>{copy.back}</button> : <span />}
        {step < 3 ? (
          <button type="button" disabled={!canContinue} onClick={() => setStep((value) => value + 1)}>{copy.continue}</button>
        ) : (
          <button type="button" disabled={role === "undecided"} onClick={createProfile}>{copy.create}</button>
        )}
      </footer>
    </section>
  );
}

export function CareerOnboardingFlow({ locale }: Readonly<{ locale: Locale }>) {
  const router = useRouter();
  const { saveProfile } = useCareerProfile();

  return (
    <CareerOnboarding
      locale={locale}
      onComplete={async (profile) => {
        await saveProfile(profile);
        router.push(`/${locale}/career-lab` as Route);
      }}
    />
  );
}
