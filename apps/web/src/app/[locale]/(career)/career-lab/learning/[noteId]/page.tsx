import { CareerLearningNote } from "@/components/career/career-learning-note";
import { resolveLocale } from "@/components/foundation-route";
import { getLearningNote } from "@/lib/career/learning-catalog";
import { careerLearningCopy } from "@/lib/career/learning-copy";

type PageProps = Readonly<{
  params: Promise<{ locale: string; noteId: string }>;
}>;

export default async function CareerLearningNotePage({ params }: PageProps) {
  const resolved = await params;
  const locale = await resolveLocale(Promise.resolve({ locale: resolved.locale }));

  if (!getLearningNote(resolved.noteId)) {
    return <p role="alert">{careerLearningCopy[locale].reader.notFound}</p>;
  }

  return <CareerLearningNote locale={locale} noteId={resolved.noteId} />;
}
