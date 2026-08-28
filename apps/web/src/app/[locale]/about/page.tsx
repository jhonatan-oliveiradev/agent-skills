import type { Metadata } from "next";
import { resolveLocale } from "@/components/foundation-route";
import { createProjectPageMetadata, getProjectPages, repositoryUrl } from "@/lib/project-pages";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createProjectPageMetadata(await resolveLocale(params), "about");
}

export default async function AboutPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const copy = getProjectPages(locale).about;
  return (
    <article className="shell project-page">
      <header className="project-page__hero"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.summary}</p></header>
      <section className="project-page__statement"><p className="eyebrow">{copy.purposeLabel}</p><p>{copy.purpose}</p></section>
      <section className="project-page__section"><p className="eyebrow">{copy.principlesLabel}</p><div className="principle-list">{copy.principles.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h2>{item.title}</h2><p>{item.summary}</p></div></article>)}</div></section>
      <aside className="project-page__callout"><div><p className="eyebrow">{copy.stewardshipLabel}</p><h2>{copy.stewardshipTitle}</h2><p>{copy.stewardship}</p></div><a className="button button--primary" href={repositoryUrl} rel="noreferrer noopener" target="_blank">{copy.sourceAction} ↗</a></aside>
    </article>
  );
}
