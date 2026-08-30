import type { Route } from "next";
import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

export type HomeClosingCopy = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  action: string;
  contribute: string;
}>;

export type HomeClosingProps = Readonly<{
  locale: Locale;
  copy: HomeClosingCopy;
}>;

export function HomeClosing({ locale, copy }: HomeClosingProps) {
  return (
    <section className="home-roadmap" data-home-section="roadmap">
      <div className="shell home-roadmap__inner">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p>{copy.summary}</p>
        </div>
        <div className="hero-actions">
          <Link className="button button--primary" href={localizePath("/roadmap", locale) as Route}>
            {copy.action}
          </Link>
          <Link className="button button--secondary" href={localizePath("/contribute", locale) as Route}>
            {copy.contribute}
          </Link>
        </div>
      </div>
    </section>
  );
}
