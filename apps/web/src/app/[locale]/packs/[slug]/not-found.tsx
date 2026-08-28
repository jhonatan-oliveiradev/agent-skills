"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { messages } from "@/lib/messages";

export default function PackNotFound() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/pt-BR/") ? "pt-BR" : "en";
  const copy = messages[locale];

  return (
    <section className="shell catalog-empty skill-not-found">
      <p className="eyebrow">404</p>
      <h1>{copy.packDetail.notFoundTitle}</h1>
      <p>{copy.packDetail.notFoundSummary}</p>
      <Link className="button button--secondary" href={`/${locale}/packs` as Route}>
        {copy.packDetail.back}
      </Link>
    </section>
  );
}
