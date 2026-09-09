"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/locale-from-pathname";
import { messages } from "@/lib/messages";

export default function SkillNotFound() {
  const locale = localeFromPathname(usePathname());
  const copy = messages[locale];

  return (
    <section className="shell global-state global-state--not-found global-state--detail">
      <div className="global-state__rail" aria-hidden="true">
        <span>404</span>
      </div>
      <div className="global-state__body">
        <p className="global-state__status">404 / SKILL</p>
        <h1>{copy.skillDetail.notFoundTitle}</h1>
        <p className="global-state__summary">{copy.skillDetail.notFoundSummary}</p>
        <div className="global-state__actions">
          <Link className="button button--primary" href={`/${locale}/skills` as Route}>
            {copy.skillDetail.back}
          </Link>
        </div>
      </div>
    </section>
  );
}
