import { CareerLearningIndex } from "@/components/career/career-learning-index";
import { resolveLocale } from "@/components/foundation-route";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function CareerLearningPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <CareerLearningIndex locale={locale} />;
}
