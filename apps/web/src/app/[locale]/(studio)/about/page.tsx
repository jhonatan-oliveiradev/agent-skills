import type { Metadata } from "next";
import { resolveLocale } from "@/components/foundation-route";
import { homeManifesto } from "@/lib/home-content";
import { createProjectPageMetadata, getProjectPages, repositoryUrl } from "@/lib/project-pages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createProjectPageMetadata(await resolveLocale(params), "about");
}

export default async function AboutPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const copy = getProjectPages(locale).about;
  const manifesto = homeManifesto[locale];

  return (
    <article className="shell editorial-colophon" data-editorial-colophon>
      <header className="editorial-colophon__hero">
        <div className="editorial-colophon__publication">
          <span>{copy.eyebrow}</span>
          <span>Agent Skills Studio</span>
        </div>
        <div className="editorial-colophon__hero-grid">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
          </div>
          <p className="editorial-colophon__summary">{copy.summary}</p>
        </div>
      </header>

      <section className="editorial-colophon__manifesto" data-manifesto-statement>
        <p className="eyebrow">{manifesto.eyebrow}</p>
        <p className="editorial-colophon__thesis">
          <span>{manifesto.titleLead}</span>{" "}
          <span>{manifesto.titleClose}</span>
        </p>
      </section>

      <section className="editorial-colophon__purpose">
        <header className="editorial-colophon__section-marker">
          <span>01</span>
          <p className="eyebrow">{copy.purposeLabel}</p>
        </header>
        <p>{copy.purpose}</p>
      </section>

      <section className="editorial-colophon__principles" aria-labelledby="about-principles-title">
        <header className="editorial-colophon__section-heading">
          <span>02</span>
          <h2 id="about-principles-title">{copy.principlesLabel}</h2>
        </header>
        <ol>
          {copy.principles.map((item, index) => (
            <li data-principle-chapter key={item.title}>
              <span className="editorial-colophon__principle-number">0{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="editorial-colophon__colophon" data-colophon>
        <header className="editorial-colophon__section-heading">
          <span>03</span>
          <div>
            <p className="eyebrow">{copy.stewardshipLabel}</p>
            <h2>{copy.stewardshipTitle}</h2>
          </div>
        </header>
        <div className="editorial-colophon__colophon-body">
          <p>{copy.stewardship}</p>
          <div className="editorial-colophon__meta" aria-label="Agent Skills Studio">
            <span>Agent Skills Studio</span>
            <span>EN / PT-BR</span>
          </div>
          <a
            className="editorial-colophon__source"
            data-interaction="navigate"
            href={repositoryUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            <span>{copy.sourceAction}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </article>
  );
}
