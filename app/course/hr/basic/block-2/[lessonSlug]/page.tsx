import {
  getHrBlock2LessonMetadata,
  HrBlock2LessonPage,
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

  return getHrBlock2LessonMetadata(getLessonNumber(lessonSlug));
}

export default async function HrBlock2LessonRoutePage({
  params,
  searchParams,
}: LessonRouteProps) {
  const { lessonSlug } = await params;

  return (
    <HrBlock2LessonPage
      lessonNumber={getLessonNumber(lessonSlug)}
      searchParams={searchParams}
    />
  );
}
