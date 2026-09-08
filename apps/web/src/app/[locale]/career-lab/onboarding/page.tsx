import { resolveLocale } from "@/components/foundation-route";
import { CareerOnboardingFlow } from "@/components/career/career-onboarding";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function CareerLabOnboardingPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <CareerOnboardingFlow locale={locale} />;
}
