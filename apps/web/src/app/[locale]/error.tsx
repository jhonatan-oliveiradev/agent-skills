"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { globalStateCopy } from "@/lib/global-state-copy";
import { localeFromPathname } from "@/lib/locale-from-pathname";

type ErrorStateProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorState({ reset }: ErrorStateProps) {
  const locale = localeFromPathname(usePathname());
  const copy = globalStateCopy[locale].error;

  return (
    <section
      className="shell global-state global-state--error"
      data-code="500"
      data-global-state="error"
    >
      <div className="global-state__rail" aria-hidden="true">
        <span>500</span>
      </div>
      <div className="global-state__body">
        <div className="global-state__brand" aria-hidden="true">
          <Image alt="" height={36} src="/brand/agent-skills-monogram.svg" width={36} />
          <span>AGENT SKILLS STUDIO</span>
        </div>
        <p className="global-state__status">{copy.status}</p>
        <h1>{copy.title}</h1>
        <p className="global-state__summary">{copy.summary}</p>
        <div className="global-state__actions">
          <button className="button button--primary" onClick={reset} type="button">
            {copy.retry}
          </button>
          <Link className="button button--secondary" href={`/${locale}/skills` as Route}>
            {copy.skills}
          </Link>
        </div>
      </div>
    </section>
  );
}
