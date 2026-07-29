import { renderAssessmentUtilityRoute } from "@/app/course/assessment-route-helpers";
import { getAiBlock1LessonMetadata, AiBlock1LessonPage } from "../LessonPageShell";

export const dynamic = "force-dynamic";

type LessonRouteProps = {
  params: Promise<{
    lessonSlug: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

function getLessonNumber(lessonSlug: string) {
  const match = lessonSlug.match(/^lesson-(\d+)$/);

  return match ? Number(match[1]) : 0;
}

export async function generateMetadata({ params }: LessonRouteProps) {
  const { lessonSlug } = await params;

  return getAiBlock1LessonMetadata(getLessonNumber(lessonSlug));
}

export default async function AiBlock1LessonRoutePage({
  params,
  searchParams,
}: LessonRouteProps) {
  const { lessonSlug } = await params;
  const assessmentRoute = await renderAssessmentUtilityRoute({
    routeSlug: lessonSlug,
    searchParams,
    slug: "ai",
  });

  if (assessmentRoute) {
    return assessmentRoute;
  }

  return (
    <AiBlock1LessonPage
      lessonNumber={getLessonNumber(lessonSlug)}
      searchParams={searchParams}
    />
  );
}
