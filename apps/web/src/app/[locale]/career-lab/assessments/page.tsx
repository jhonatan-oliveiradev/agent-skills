import { AssessmentList } from "@/components/career/assessment-list";
import { baselineAssessmentBlueprints } from "@/lib/career/assessment-blueprints";
import { resolveLocale } from "@/components/foundation-route";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function AssessmentsPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <AssessmentList locale={locale} blueprints={baselineAssessmentBlueprints} />;
}
