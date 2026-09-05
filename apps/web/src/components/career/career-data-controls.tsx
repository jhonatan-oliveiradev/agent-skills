"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { careerLabCopy } from "@/lib/career/copy";
import { migrateCareerProfile } from "@/lib/career/migrations";
import type { CareerProfile } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";

export function serializeCareerProfile(profile: CareerProfile): string {
  return `${JSON.stringify(profile, null, 2)}\n`;
}

export function getCareerProfileExportFilename(now = new Date()): string {
  return `agent-skills-career-profile-${now.toISOString().slice(0, 10)}.json`;
}

export function CareerDataControls({ locale }: Readonly<{ locale: Locale }>) {
  const copy = careerLabCopy[locale];
  const { profile, replaceProfile, resetProfile } = useCareerProfile();
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function exportProfile() {
    if (!profile) return;
    const blob = new Blob([serializeCareerProfile(profile)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getCareerProfileExportFilename();
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importProfile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const nextProfile = migrateCareerProfile(parsed);
      await replaceProfile(nextProfile);
      setMessage(copy.importSuccess);
    } catch {
      setMessage(copy.importFailed);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function confirmReset() {
    await resetProfile();
    setConfirmingReset(false);
    setMessage(copy.resetComplete);
  }

  if (!profile) return null;

  return (
    <section className="career-data-controls" aria-labelledby="career-data-title">
      <p className="career-card__label" id="career-data-title">{copy.localData}</p>
      <div className="career-data-controls__actions">
        <button type="button" onClick={exportProfile}>{copy.exportProfile}</button>
        <label className="career-data-controls__import" htmlFor="career-profile-import">
          {copy.importProfile}
        </label>
        <input
          accept="application/json,.json"
          id="career-profile-import"
          ref={inputRef}
          type="file"
          onChange={(event) => void importProfile(event)}
        />
        {!confirmingReset ? (
          <button type="button" onClick={() => setConfirmingReset(true)}>{copy.resetProfile}</button>
        ) : (
          <div className="career-data-controls__confirm">
            <p>{copy.resetWarning}</p>
            <button type="button" onClick={() => void confirmReset()}>{copy.confirmReset}</button>
            <button type="button" onClick={() => setConfirmingReset(false)}>{copy.cancel}</button>
          </div>
        )}
      </div>
      {message ? <p role="status" className="career-data-controls__status">{message}</p> : null}
    </section>
  );
}
