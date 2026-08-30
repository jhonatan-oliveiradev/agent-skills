import type { Route } from "next";
import Link from "next/link";

export type HomeMethodIndexItem = Readonly<{
  slug: string;
  displayName: string;
  discipline: string;
  category: string;
  href: Route;
}>;

export type HomeMethodIndexProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  viewAllLabel: string;
  viewAllHref: Route;
  methods: readonly HomeMethodIndexItem[];
}>;

export function HomeMethodIndex({ eyebrow, title, summary, viewAllLabel, viewAllHref, methods }: HomeMethodIndexProps) {
  return (
    <section className="home-methods-v2" data-home-section="methods">
      <div className="shell">
        <div className="home-editorial-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div>
            <p>{summary}</p>
            <Link href={viewAllHref}>{viewAllLabel} →</Link>
          </div>
        </div>

        <ol className="home-method-index">
          {methods.map((method, index) => (
            <li key={method.slug}>
              <Link href={method.href}>
                <span className="home-method-index__number">{String(index + 1).padStart(2, "0")}</span>
                <span className="home-method-index__name">
                  <strong>{method.displayName}</strong>
                  <small>{method.discipline}</small>
                </span>
                <span className="home-method-index__meta">{method.category}</span>
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M5 12h13M13 7l5 5-5 5" />
                </svg>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
