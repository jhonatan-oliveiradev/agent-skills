import type { Route } from "next";
import Link from "next/link";

export type HomePackDossierItem = Readonly<{
  slug: string;
  name: string;
  summary: string;
  version: string;
  status: "active" | "planned";
  skillCount: number;
  outcomes: readonly string[];
  representativeSkills: readonly string[];
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
    <section className="home-packs-v2 home-pack-archive" data-home-section="packs">
      <div className="shell">
        <div className="home-editorial-heading home-pack-archive__heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div>
            <p>{summary}</p>
            <Link href={viewAllHref}>{viewAllLabel} →</Link>
          </div>
        </div>

        <div className="home-pack-dossiers">
          {packs.map((pack, index) => (
            <article
              className="home-pack-dossier"
              data-pack-index={String(index + 1).padStart(2, "0")}
              key={pack.slug}
            >
              <div className="home-pack-dossier__meta">
                <span>{skillsTemplate.replace("{count}", String(pack.skillCount))}</span>
                <span>{pack.status}</span>
                <span>{pack.version}</span>
              </div>

              <div className="home-pack-dossier__body">
                <div>
                  <h3>{pack.name}</h3>
                  <p>{pack.summary}</p>
                </div>

                <div className="home-pack-dossier__evidence">
                  <ul className="home-pack-dossier__outcomes">
                    {pack.outcomes.slice(0, 2).map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>

                  <ul className="home-pack-dossier__skills" aria-label={`${pack.name} skills`}>
                    {pack.representativeSkills.slice(0, 3).map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link className="home-pack-dossier__link" href={pack.href}>
                {viewLabel} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
