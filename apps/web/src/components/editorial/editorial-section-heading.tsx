export function EditorialSectionHeading({
  eyebrow,
  title,
  summary,
  id,
}: Readonly<{
  eyebrow?: string;
  title: string;
  summary?: string;
  id?: string;
}>) {
  return (
    <div className="editorial-section-heading" data-editorial-heading>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id}>{title}</h2>
      {summary ? <p className="editorial-section-heading__summary">{summary}</p> : null}
    </div>
  );
}
