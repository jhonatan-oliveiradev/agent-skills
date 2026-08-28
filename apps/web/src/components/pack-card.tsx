import type { Route } from "next";
import Link from "next/link";
import type { LocalizedPack } from "@/lib/catalog";

export function PackCard({
  pack,
  href,
  labels,
}: Readonly<{
  pack: LocalizedPack;
  href: string;
  labels: Readonly<{ active: string; planned: string; skills: string; compositionPending: string; view: string }>;
}>) {
  const status = pack.status === "active" ? labels.active : labels.planned;

  return (
    <article className="pack-card" data-color={pack.color} data-status={pack.status}>
      <Link className="pack-card__link" href={href as Route}>
        <div className="pack-card__meta">
          <span>{status}</span>
          <span>{pack.status === "planned" ? labels.compositionPending : labels.skills.replace("{count}", String(pack.skills.length))}</span>
        </div>
        <h2>{pack.name}</h2>
        <p>{pack.summary}</p>
        <span className="pack-card__action">{labels.view} →</span>
      </Link>
    </article>
  );
}
