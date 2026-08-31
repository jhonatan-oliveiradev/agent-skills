export interface EditorialReaderNavItem {
  readonly id: string;
  readonly label: string;
}

export function EditorialReaderNav({
  label,
  items,
}: Readonly<{
  label: string;
  items: readonly EditorialReaderNavItem[];
}>) {
  return (
    <nav aria-label={label} className="editorial-reader-nav" data-interaction="navigate">
      <p className="editorial-reader-nav__label">{label}</p>
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
