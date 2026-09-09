import { CareerRoadmapSurface } from "@/components/career/career-roadmap";
import { resolveLocale } from "@/components/foundation-route";
import "@/styles/career-roadmap.css";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function RoadmapPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <CareerRoadmapSurface locale={locale} />;
}
