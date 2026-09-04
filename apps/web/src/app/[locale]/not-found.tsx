"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { globalStateCopy } from "@/lib/global-state-copy";
import { localeFromPathname } from "@/lib/locale-from-pathname";

export default function NotFound() {
  const locale = localeFromPathname(usePathname());
  const copy = globalStateCopy[locale].notFound;

  return (
    <section
      className="shell global-state global-state--not-found"
      data-code="404"
      data-global-state="not-found"
    >
      <div className="global-state__rail" aria-hidden="true">
        <span>404</span>
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
          <Link className="button button--primary" href={`/${locale}/skills` as Route}>
            {copy.skills}
          </Link>
          <Link className="button button--secondary" href={`/${locale}` as Route}>
            {copy.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
