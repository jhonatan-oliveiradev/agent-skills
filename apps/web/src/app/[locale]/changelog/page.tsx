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
    <article className="shell project-page">
      <header className="project-page__hero"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.summary}</p></header>
      <section className="project-page__section" aria-label={copy.releasesLabel}>{copy.releases.map((release) => <article className="release" key={release.version}><header><div><p className="eyebrow">{release.date}</p><h2>{release.version}</h2></div><span>{release.date}</span></header><div className="release__groups">{release.groups.map((group) => <section key={group.title}><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div></article>)}</section>
      <a className="project-page__source" href={`${repositoryUrl}/blob/main/CHANGELOG.md`} rel="noreferrer noopener" target="_blank">{copy.sourceAction} ↗</a>
    </article>
  );
}
