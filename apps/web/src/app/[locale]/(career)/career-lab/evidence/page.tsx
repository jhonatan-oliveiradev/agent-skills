import { EvidenceLedgerSurface } from "@/components/career/evidence-ledger";
import { resolveLocale } from "@/components/foundation-route";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function EvidencePage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <EvidenceLedgerSurface locale={locale} />;
}
