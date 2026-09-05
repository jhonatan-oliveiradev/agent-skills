import { AssessmentDetailSurface } from "@/components/career/assessment-runner";
import { getAssessmentBlueprint } from "@/lib/career/assessment-blueprints";
import { resolveLocale } from "@/components/foundation-route";

type PageProps = Readonly<{ params: Promise<{ locale: string; id: string }> }>;

export default async function AssessmentDetailPage({ params }: PageProps) {
  const resolved = await params;
  const locale = await resolveLocale(Promise.resolve({ locale: resolved.locale }));
  if (!getAssessmentBlueprint(resolved.id)) {
    return <p role="alert">Assessment not found.</p>;
  }
  return <AssessmentDetailSurface locale={locale} blueprintId={resolved.id} />;
}
