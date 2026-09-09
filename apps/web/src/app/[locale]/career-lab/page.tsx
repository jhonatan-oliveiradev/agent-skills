import { CareerLabHome } from "@/components/career/career-lab-home";
import { resolveLocale } from "@/components/foundation-route";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function CareerLabPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <CareerLabHome locale={locale} />;
}
