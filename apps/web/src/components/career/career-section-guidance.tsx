import Link from "next/link";
import type { Route } from "next";

interface CareerSectionGuidanceProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly action?: Readonly<{
    href: Route;
    label: string;
  }>;
}

export function CareerSectionGuidance({
  eyebrow,
  title,
  body,
  action,
}: Readonly<CareerSectionGuidanceProps>) {
  return (
    <section className="career-next-action career-section-guidance" aria-label={title}>
      <p className="career-lab__eyebrow">{eyebrow}</p>
      <div className="career-next-action__body">
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      {action ? (
        <Link className="career-next-action__link" href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </section>
  );
}
