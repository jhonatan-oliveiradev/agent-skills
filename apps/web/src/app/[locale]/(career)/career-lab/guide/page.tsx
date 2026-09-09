import { CareerGuide } from "@/components/career/career-guide";
import { resolveLocale } from "@/components/foundation-route";
import "@/styles/career-guidance.css";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function GuidePage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <CareerGuide locale={locale} />;
}
