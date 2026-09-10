import { AssessmentList } from "@/components/career/assessment-list";
import { resolveLocale } from "@/components/foundation-route";
import { baselineAssessmentBlueprints } from "@/lib/career/assessment-blueprints";
import "@/styles/career-assessments.css";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function AssessmentsPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <AssessmentList locale={locale} blueprints={baselineAssessmentBlueprints} />;
}
