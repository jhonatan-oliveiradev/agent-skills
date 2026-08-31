import type { Route } from "next";
import Link from "next/link";
import type { LocalizedPack } from "@/lib/catalog";

export interface PackDossierLabels {
  readonly active: string;
  readonly planned: string;
  readonly methods: string;
  readonly composition: string;
  readonly compositionPending: string;
  readonly explore: string;
}

export function PackDossier({
  pack,
  index,
  href,
  labels,
}: Readonly<{
  pack: LocalizedPack;
  index: number;
  href: string;
  labels: PackDossierLabels;
}>) {
  const statusLabel = pack.status === "active" ? labels.active : labels.planned;
  const methods = pack.skills.slice(0, 4);

  return (
    <article
      className="pack-dossier"
      data-pack-dossier
      data-status={pack.status}
      data-color={pack.color}
    >
      <Link
        className="pack-dossier__link"
        data-interaction="navigate"
        href={href as Route}
      >
        <div className="pack-dossier__ordinal" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="pack-dossier__identity">
          <div className="pack-dossier__status">
            <span>{statusLabel}</span>
            <span>
              {pack.skills.length
                ? `${String(pack.skills.length).padStart(2, "0")} ${labels.methods}`
                : labels.compositionPending}
            </span>
          </div>
          <h2>{pack.name}</h2>
          <p>{pack.summary}</p>
        </div>

        <div className="pack-dossier__composition" data-interaction="connect">
          <p>{labels.composition}</p>
          {methods.length ? (
            <ol>
              {methods.map((skill, methodIndex) => (
                <li key={skill.slug}>
                  <span>{String(methodIndex + 1).padStart(2, "0")}</span>
                  {skill.displayName}
                </li>
              ))}
            </ol>
          ) : (
            <span className="pack-dossier__pending">{labels.compositionPending}</span>
          )}
        </div>

        <div className="pack-dossier__action">
          <span>{labels.explore}</span>
          <span aria-hidden="true">↗</span>
        </div>
      </Link>
    </article>
  );
}
