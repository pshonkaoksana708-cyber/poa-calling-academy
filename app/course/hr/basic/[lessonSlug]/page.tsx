import { renderAssessmentUtilityRoute } from "@/app/course/assessment-route-helpers";
import { getHrBlock1LessonMetadata, HrBlock1LessonPage } from "../LessonPageShell";

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

  return getHrBlock1LessonMetadata(getLessonNumber(lessonSlug));
}

export default async function HrBlock1LessonRoutePage({
  params,
  searchParams,
}: LessonRouteProps) {
  const { lessonSlug } = await params;
  const assessmentRoute = await renderAssessmentUtilityRoute({
    routeSlug: lessonSlug,
    searchParams,
    slug: "hr",
  });

  if (assessmentRoute) {
    return assessmentRoute;
  }

  return (
    <HrBlock1LessonPage
      lessonNumber={getLessonNumber(lessonSlug)}
      searchParams={searchParams}
    />
  );
}
