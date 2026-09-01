import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  createFoundationMetadata,
  resolveLocale,
} from "@/components/foundation-route";
import { livingProgramCopy } from "@/lib/editorial-secondary-copy";
import { messages } from "@/lib/messages";
import { getRoadmapStages } from "@/lib/roadmap";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createFoundationMetadata(await resolveLocale(params), "roadmap");
}

export default async function RoadmapPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const copy = messages[locale];
  const program = livingProgramCopy[locale];
  const stages = getRoadmapStages(locale);
  const entryCount = stages.reduce((total, stage) => total + stage.items.length, 0);
  const emptyStageCount = stages.filter((stage) => stage.items.length === 0).length;

  return (
    <article className="shell roadmap-page living-program" data-living-program>
      <header className="living-program__hero">
        <div className="living-program__publication">
          <span>{program.publicationLabel}</span>
          <span>{copy.roadmap.eyebrow}</span>
        </div>

        <div className="living-program__hero-grid">
          <div className="living-program__hero-copy">
            <h1>{copy.foundation.roadmap.title}</h1>
            <p>{copy.foundation.roadmap.summary}</p>
          </div>

          <dl className="living-program__metrics">
            <Metric label={program.metrics.stages} value={String(stages.length).padStart(2, "0")} />
            <Metric label={program.metrics.entries} value={String(entryCount).padStart(2, "0")} />
            <Metric label={program.metrics.empty} value={String(emptyStageCount).padStart(2, "0")} />
          </dl>
        </div>
      </header>

      <nav
        className="living-program__index"
        data-program-index
        aria-label={program.indexLabel}
      >
        <p>{program.indexLabel}</p>
        <ol>
          {stages.map((stage, index) => (
            <li key={stage.id}>
              <a data-interaction="navigate" href={`#${stage.id}`}>
                <span className="living-program__index-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{stage.title}</strong>
                <span className="living-program__index-count">
                  {formatEntryCount(stage.items.length, program.entrySingular, program.entryPlural)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <aside className="living-program__principle">
        <p className="eyebrow">{copy.roadmap.principleLabel}</p>
        <p>{copy.roadmap.principle}</p>
      </aside>

      <div className="living-program__chapters">
        {stages.map((stage, index) => {
          const isEmpty = stage.items.length === 0;

          return (
            <section
              className="living-program__chapter"
              data-empty={isEmpty ? "true" : "false"}
              data-program-stage={stage.id}
              data-stage={stage.id}
              id={stage.id}
              key={stage.id}
            >
              <header className="living-program__chapter-header">
                <span className="living-program__chapter-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2>{stage.title}</h2>
                  <p>{stage.description}</p>
                </div>
                <strong>
                  {formatEntryCount(stage.items.length, program.entrySingular, program.entryPlural)}
                </strong>
              </header>

              {isEmpty ? (
                <div className="living-program__empty">
                  <span>{program.emptyLabel}</span>
                  <p>{stage.empty}</p>
                </div>
              ) : (
                <div className="living-program__records">
                  {stage.items.map((item) => (
                    <article className="living-program__record" data-program-record key={item.id}>
                      <p className="living-program__record-meta">{item.meta}</p>
                      <div className="living-program__record-copy">
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                      </div>
                      {item.href ? (
                        <Link data-interaction="connect" href={item.href as Route}>
                          <span>{copy.roadmap.viewItem}</span>
                          <ArrowIcon />
                        </Link>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <aside className="living-program__contribute">
        <div>
          <p className="eyebrow">{copy.roadmap.contributeLabel}</p>
          <h2>{copy.roadmap.contributeTitle}</h2>
          <p>{copy.roadmap.contributeSummary}</p>
        </div>
        <a
          className="button button--primary"
          data-interaction="navigate"
          href="https://github.com/jhonatan-oliveiradev/agent-skills/issues"
          rel="noreferrer noopener"
          target="_blank"
        >
          <span>{copy.roadmap.contributeAction}</span>
          <ExternalArrowIcon />
        </a>
      </aside>
    </article>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatEntryCount(count: number, singular: string, plural: string) {
  return `${String(count).padStart(2, "0")} ${count === 1 ? singular : plural}`;
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M5 11 11 5M6.5 5H11v4.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
