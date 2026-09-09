import type { Metadata } from "next";
import { resolveLocale } from "@/components/foundation-route";
import { createProjectPageMetadata, getProjectPages } from "@/lib/project-pages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createProjectPageMetadata(await resolveLocale(params), "contribute");
}

export default async function ContributePage({ params }: PageProps) {
  const copy = getProjectPages(await resolveLocale(params)).contribute;

  return (
    <article className="shell institutional-page institutional-page--contribute" data-institutional-contribute>
      <header className="institutional-page__hero">
        <div className="institutional-page__publication">
          <span>{copy.eyebrow}</span>
          <span>{copy.pathsLabel}</span>
        </div>
        <div className="institutional-page__hero-grid">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
          </div>
          <p>{copy.summary}</p>
        </div>
      </header>

      <section className="institutional-page__section" aria-labelledby="contribution-paths-title">
        <header className="institutional-page__section-heading">
          <span aria-hidden="true">01</span>
          <h2 id="contribution-paths-title">{copy.pathsLabel}</h2>
        </header>
        <ol className="institutional-page__records">
          {copy.paths.map((path) => (
            <li className="institutional-page__record" key={path.index}>
              <span className="institutional-page__record-index">{path.index}</span>
              <div className="institutional-page__record-body">
                <h3>{path.title}</h3>
                <p>{path.summary}</p>
              </div>
              <a
                className="institutional-page__record-action"
                data-interaction="navigate"
                href={path.href}
                rel="noreferrer noopener"
                target="_blank"
              >
                {path.action} ↗
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="institutional-page__expectations" aria-labelledby="contribution-expectations-title">
        <header className="institutional-page__section-heading">
          <span aria-hidden="true">02</span>
          <div>
            <p className="eyebrow">{copy.expectationsLabel}</p>
            <h2 id="contribution-expectations-title">{copy.expectationsTitle}</h2>
          </div>
        </header>
        <ol>
          {copy.expectations.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
