"use client";

import { usePathname } from "next/navigation";
import { globalStateCopy } from "@/lib/global-state-copy";
import { localeFromPathname } from "@/lib/locale-from-pathname";

export default function Loading() {
  const locale = localeFromPathname(usePathname());
  const copy = globalStateCopy[locale].loading;

  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="shell global-state global-state--loading"
      data-global-state="loading"
      role="status"
    >
      <div className="global-state__rail" aria-hidden="true">
        <span>•••</span>
      </div>
      <div className="global-state__body">
        <p className="global-state__status">{copy.status}</p>
        <h1>{copy.title}</h1>
        <p className="global-state__summary">{copy.summary}</p>
      </div>
    </section>
  );
}
