"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { messages } from "@/lib/messages";

export default function SkillNotFound() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/pt-BR/") ? "pt-BR" : "en";
  const copy = messages[locale];

  return (
    <section className="shell catalog-empty skill-not-found">
      <p className="eyebrow">404</p>
      <h1>{copy.skillDetail.notFoundTitle}</h1>
      <p>{copy.skillDetail.notFoundSummary}</p>
      <Link className="button button--secondary" href={`/${locale}/skills` as Route}>
        {copy.skillDetail.back}
      </Link>
    </section>
  );
}
