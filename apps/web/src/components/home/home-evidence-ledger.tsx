import type { Route } from "next";
import Link from "next/link";

export type HomeEvidenceLedgerRow = Readonly<{
  id: string;
  method: string;
  methodHref: Route;
  usedIn: string;
  usedInHref?: Route;
  evidence: string;
  evidenceHref: string | Route;
  external: boolean;
}>;

export type HomeEvidenceLedgerProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  methodLabel: string;
  usedInLabel: string;
  evidenceLabel: string;
  viewAllLabel: string;
  viewAllHref: Route;
  rows: readonly HomeEvidenceLedgerRow[];
}>;

export function HomeEvidenceLedger({
  eyebrow,
  title,
  summary,
  methodLabel,
  usedInLabel,
  evidenceLabel,
  viewAllLabel,
  viewAllHref,
  rows,
}: HomeEvidenceLedgerProps) {
  return (
    <section className="home-ledger" data-home-section="ledger">
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

        <div className="home-evidence-ledger">
          <table>
            <thead>
              <tr>
                <th scope="col">{methodLabel}</th>
                <th scope="col">{usedInLabel}</th>
                <th scope="col">{evidenceLabel}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><Link href={row.methodHref}>{row.method}</Link></td>
                  <td>{row.usedInHref ? <Link href={row.usedInHref}>{row.usedIn}</Link> : row.usedIn}</td>
                  <td>
                    {row.external ? (
                      <a href={String(row.evidenceHref)} rel="noreferrer noopener" target="_blank">{row.evidence} ↗</a>
                    ) : (
                      <Link href={row.evidenceHref as Route}>{row.evidence} →</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
