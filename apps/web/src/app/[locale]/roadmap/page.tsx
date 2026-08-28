import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import {
  createFoundationMetadata,
  resolveLocale,
} from "@/components/foundation-route";
import { getRoadmapStages } from "@/lib/roadmap";
import { messages } from "@/lib/messages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createFoundationMetadata(await resolveLocale(params), "roadmap");
}

export default async function RoadmapPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const copy = messages[locale];
  const stages = getRoadmapStages(locale);

  return (
    <article className="shell roadmap-page">
      <header className="roadmap__hero">
        <p className="eyebrow">{copy.roadmap.eyebrow}</p>
        <h1>{copy.foundation.roadmap.title}</h1>
        <p>{copy.foundation.roadmap.summary}</p>
      </header>

      <aside className="roadmap__principle">
        <p className="eyebrow">{copy.roadmap.principleLabel}</p>
        <p>{copy.roadmap.principle}</p>
      </aside>

      <div className="roadmap-stages">
        {stages.map((stage, index) => (
          <section className="roadmap-stage" data-stage={stage.id} key={stage.id}>
            <header>
              <span>0{index + 1}</span>
              <div>
                <h2>{stage.title}</h2>
                <p>{stage.description}</p>
              </div>
              <strong>{stage.items.length}</strong>
            </header>
            {stage.items.length ? (
              <div className="roadmap-item-list">
                {stage.items.map((item) => (
                  <article className="roadmap-item" key={item.id}>
                    <div><span>{item.meta}</span><h3>{item.title}</h3><p>{item.summary}</p></div>
                    {item.href ? <Link href={item.href as Route}>{copy.roadmap.viewItem} →</Link> : null}
                  </article>
                ))}
              </div>
            ) : <p className="roadmap-stage__empty">{stage.empty}</p>}
          </section>
        ))}
      </div>

      <aside className="roadmap__contribute">
        <div><p className="eyebrow">{copy.roadmap.contributeLabel}</p><h2>{copy.roadmap.contributeTitle}</h2><p>{copy.roadmap.contributeSummary}</p></div>
        <a className="button button--primary" href="https://github.com/jhonatan-oliveiradev/agent-skills/issues" rel="noreferrer noopener" target="_blank">{copy.roadmap.contributeAction} ↗</a>
      </aside>
    </article>
  );
}
