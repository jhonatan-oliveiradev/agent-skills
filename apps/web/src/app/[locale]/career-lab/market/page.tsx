import { MarketIntelligenceSurface } from "@/components/career/market-analysis";
import { resolveLocale } from "@/components/foundation-route";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function MarketPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <MarketIntelligenceSurface locale={locale} />;
}
