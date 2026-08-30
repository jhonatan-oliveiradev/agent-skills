import type { Route } from "next";
import Link from "next/link";

export type HomePackDossierItem = Readonly<{
  slug: string;
  name: string;
  summary: string;
  version: string;
  skillCount: number;
  outcomes: readonly string[];
  href: Route;
}>;

export type HomePackDossiersProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  skillsTemplate: string;
  viewLabel: string;
  viewAllLabel: string;
  viewAllHref: Route;
  packs: readonly HomePackDossierItem[];
}>;

export function HomePackDossiers({
  eyebrow,
  title,
  summary,
  skillsTemplate,
  viewLabel,
  viewAllLabel,
  viewAllHref,
  packs,
}: HomePackDossiersProps) {
  return (
    <section className="home-packs-v2" data-home-section="packs">
      <div className="shell">
        <div className="home-editorial-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div>
            <p>{summary}</p>
            <Link href={viewAllHref}>{viewAllLabel} →</Link>
          </div>
        </div>

        <div className="home-pack-rail">
          {packs.map((pack) => (
            <article key={pack.slug}>
              <div className="home-pack-rail__meta">
                <span>{skillsTemplate.replace("{count}", String(pack.skillCount))}</span>
                <span>{pack.version}</span>
              </div>
              <h3>{pack.name}</h3>
              <p>{pack.summary}</p>
              <ul>
                {pack.outcomes.slice(0, 2).map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
              <Link href={pack.href}>{viewLabel} →</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
