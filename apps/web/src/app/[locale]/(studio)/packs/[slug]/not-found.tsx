"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { editorialPacksCopy } from "@/lib/editorial-packs-copy";
import { localeFromPathname } from "@/lib/locale-from-pathname";
import { messages } from "@/lib/messages";

export default function PackNotFound() {
  const locale = localeFromPathname(usePathname());
  const copy = messages[locale];
  const editorialCopy = editorialPacksCopy[locale];

  return (
    <section className="shell global-state global-state--not-found global-state--detail">
      <div className="global-state__rail" aria-hidden="true">
        <span>404</span>
      </div>
      <div className="global-state__body">
        <p className="global-state__status">404 / PACK</p>
        <h1>{copy.packDetail.notFoundTitle}</h1>
        <p className="global-state__summary">{copy.packDetail.notFoundSummary}</p>
        <div className="global-state__actions">
          <Link className="button button--primary" href={`/${locale}/packs` as Route}>
            {editorialCopy.notFoundAction}
          </Link>
        </div>
      </div>
    </section>
  );
}
