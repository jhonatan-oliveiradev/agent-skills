import type { ReactNode } from "react";

export interface EditorialMetadataItem {
  readonly label: string;
  readonly value: ReactNode;
}

export function EditorialMetadata({
  items,
  className,
}: Readonly<{
  items: readonly EditorialMetadataItem[];
  className?: string;
}>) {
  const classes = ["editorial-page__metadata", className].filter(Boolean).join(" ");

  return (
    <dl className={classes}>
      {items.map((item, index) => (
        <div className="editorial-page__metadata-item" key={`${item.label}-${index}`}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
