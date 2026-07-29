import { renderAssessmentUtilityRoute } from "@/app/course/assessment-route-helpers";
import {
  getSupplyBasicLessonMetadata,
  SupplyBasicLessonPage,
} from "../LessonPageShell";

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

  return getSupplyBasicLessonMetadata(getLessonNumber(lessonSlug));
}

export default async function SupplyBasicLessonRoutePage({
  params,
  searchParams,
}: LessonRouteProps) {
  const { lessonSlug } = await params;
  const assessmentRoute = await renderAssessmentUtilityRoute({
    routeSlug: lessonSlug,
    searchParams,
    slug: "supply",
  });

  if (assessmentRoute) {
    return assessmentRoute;
  }

  return (
    <SupplyBasicLessonPage
      lessonNumber={getLessonNumber(lessonSlug)}
      searchParams={searchParams}
    />
  );
}
