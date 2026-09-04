"use client";

import Image from "next/image";
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
      className="shell global-state global-state--loading global-preloader"
      data-global-state="loading"
      role="status"
    >
      <div className="global-preloader__frame" aria-hidden="true">
        <span>AGENT SKILLS STUDIO</span>
        <span>{locale === "pt-BR" ? "RESOLVENDO MÉTODO" : "RESOLVING METHOD"}</span>
      </div>

      <div className="global-preloader__mark" aria-hidden="true">
        <Image
          alt=""
          height={112}
          priority
          src="/brand/agent-skills-monogram.svg"
          width={112}
        />
        <span className="global-preloader__scan" />
      </div>

      <div className="global-state__body global-preloader__body">
        <p className="global-state__status">{copy.status}</p>
        <h1>{copy.title}</h1>
        <p className="global-state__summary">{copy.summary}</p>
        <div className="global-preloader__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
