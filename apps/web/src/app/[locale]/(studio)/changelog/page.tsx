import type { Metadata } from "next";
import { resolveLocale } from "@/components/foundation-route";
import { createProjectPageMetadata, getProjectPages, repositoryUrl } from "@/lib/project-pages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createProjectPageMetadata(await resolveLocale(params), "changelog");
}

export default async function ChangelogPage({ params }: PageProps) {
  const copy = getProjectPages(await resolveLocale(params)).changelog;

  return (
    <article className="shell institutional-page institutional-changelog" data-institutional-changelog>
      <header className="institutional-page__hero">
        <div className="institutional-page__publication">
          <span>{copy.eyebrow}</span>
          <span>{copy.releasesLabel}</span>
        </div>
        <div className="institutional-page__hero-grid">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
          </div>
          <p>{copy.summary}</p>
        </div>
      </header>

      <section className="institutional-page__section" aria-label={copy.releasesLabel}>
        <header className="institutional-page__section-heading">
          <span aria-hidden="true">01</span>
          <h2>{copy.releasesLabel}</h2>
        </header>
        <div className="institutional-changelog__releases">
          {copy.releases.map((release, releaseIndex) => (
            <article className="institutional-changelog__release" data-release-record key={`${release.version}-${release.date}`}>
              <header>
                <span>{String(releaseIndex + 1).padStart(2, "0")}</span>
                <div>
                  <p>{release.date}</p>
                  <h3>{release.version}</h3>
                </div>
              </header>
              <div className="institutional-changelog__groups">
                {release.groups.map((group) => (
                  <section key={group.title}>
                    <h4>{group.title}</h4>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <a
        className="institutional-page__source-action"
        data-interaction="navigate"
        href={`${repositoryUrl}/blob/main/CHANGELOG.md`}
        rel="noreferrer noopener"
        target="_blank"
      >
        {copy.sourceAction} ↗
      </a>
    </article>
  );
}
