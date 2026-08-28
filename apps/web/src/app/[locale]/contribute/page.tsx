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
    <article className="shell project-page">
      <header className="project-page__hero"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.summary}</p></header>
      <section className="project-page__section"><p className="eyebrow">{copy.pathsLabel}</p><div className="contribution-grid">{copy.paths.map((path) => <article key={path.index}><span>{path.index}</span><h2>{path.title}</h2><p>{path.summary}</p><a href={path.href} rel="noreferrer noopener" target="_blank">{path.action} ↗</a></article>)}</div></section>
      <section className="project-page__expectations"><div><p className="eyebrow">{copy.expectationsLabel}</p><h2>{copy.expectationsTitle}</h2></div><ol>{copy.expectations.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></section>
    </article>
  );
}
