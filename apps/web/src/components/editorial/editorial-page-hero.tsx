import type { ReactNode } from "react";
import { EditorialMetadata, type EditorialMetadataItem } from "./editorial-metadata";

export function EditorialPageHero({
  eyebrow,
  title,
  summary,
  metadata,
  className,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  metadata?: readonly EditorialMetadataItem[];
  className?: string;
  children?: ReactNode;
}>) {
  const classes = ["editorial-page__hero", className].filter(Boolean).join(" ");

  return (
    <header className={classes} data-editorial-hero>
      <div className="editorial-page__hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="editorial-page__hero-summary">{summary}</p>
        {children}
      </div>
      {metadata?.length ? <EditorialMetadata items={metadata} /> : null}
    </header>
  );
}
