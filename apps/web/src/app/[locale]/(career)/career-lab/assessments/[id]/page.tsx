import { resolveLocale } from "@/components/foundation-route";
import { AssessmentDetailSurface } from "@/components/career/assessment-runner";
import { getAssessmentBlueprint } from "@/lib/career/assessment-blueprints";
import { careerLabCopy } from "@/lib/career/copy";
import "@/styles/career-assessments.css";

type PageProps = Readonly<{ params: Promise<{ locale: string; id: string }> }>;

export default async function AssessmentDetailPage({ params }: PageProps) {
  const resolved = await params;
  const locale = await resolveLocale(Promise.resolve({ locale: resolved.locale }));
  if (!getAssessmentBlueprint(resolved.id)) {
    return <p role="alert">{careerLabCopy[locale].assessment.notFound}</p>;
  }
  return <AssessmentDetailSurface locale={locale} blueprintId={resolved.id} />;
}
