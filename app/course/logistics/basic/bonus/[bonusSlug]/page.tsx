import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/seo";
import { headers } from "next/headers";
import { supportEmail } from "@/data/config/email";
import {
  logisticsBonusLessons,
  logisticsBonusLessonsBySlug,
} from "@/data/professions/logistics/bonus-lessons";
import { validateAccessTokenForPrograms } from "@/lib/course-access";
import { LessonExperience } from "@/app/course/supply/basic/LessonExperience";
import { appendToken, logisticsBlock3AccessKeys } from "../../access";

export const dynamic = "force-dynamic";

type BonusLessonRouteProps = {
  params: Promise<{
    bonusSlug: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export async function generateMetadata({
  params,
}: BonusLessonRouteProps): Promise<Metadata> {
  const { bonusSlug } = await params;
  const lesson = logisticsBonusLessonsBySlug[bonusSlug];

  return {
    title: lesson
      ? `${lesson.professionTitle}: ${lesson.title}`
      : "Бонусный материал",
    description: lesson
      ? `Дополнительный материал образовательной программы «Специалист по международной логистике».`
      : undefined,
    robots: noIndexRobots,
  };
}

async function isLocalLessonPreview() {
  const host = (await headers()).get("host") ?? "";

  return (
    process.env.NODE_ENV !== "production" &&
    (host.startsWith("localhost:") ||
      host.startsWith("127.0.0.1:") ||
      host.startsWith("[::1]:"))
  );
}

function AccessDenied({ token }: { token?: string }) {
  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <div className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Защищенный доступ
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
            Нет доступа к материалу
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            Бонусные материалы доступны после завершения профессионального
            уровня по защищенной ссылке.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href={appendToken("/course/logistics/basic", token)}
            >
              Вернуться к программе
            </a>
            <a
              className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
              href={`mailto:${supportEmail}`}
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function LogisticsBonusLessonPage({
  params,
  searchParams,
}: BonusLessonRouteProps) {
  const { bonusSlug } = await params;
  const { token } = await searchParams;
  const lesson = logisticsBonusLessonsBySlug[bonusSlug];
  const access = validateAccessTokenForPrograms(token, logisticsBlock3AccessKeys);
  const localPreview = await isLocalLessonPreview();

  if (!lesson) {
    return <AccessDenied token={token} />;
  }

  if (!access.ok && (!localPreview || token)) {
    return <AccessDenied token={token} />;
  }

  const lessonNavigation = logisticsBonusLessons.map((item) => ({
    href: appendToken(`/course/logistics/basic/bonus/${item.slug}`, token),
    lessonNumber: item.lessonNumber,
    title: item.title,
  }));
  const currentIndex = logisticsBonusLessons.findIndex(
    (item) => item.slug === lesson.slug,
  );
  const previousLesson = logisticsBonusLessons[currentIndex - 1];
  const nextLesson = logisticsBonusLessons[currentIndex + 1];

  return (
    <LessonExperience
      backHref={appendToken(
        "/course/logistics/basic/completed?package=professional",
        token,
      )}
      completionHref={appendToken(
        "/course/logistics/basic/completed?package=professional",
        token,
      )}
      completionLabel="Вернуться к завершению"
      displayLessonNumber={lesson.lessonNumber}
      displayTotalLessons={lesson.totalLessons}
      lesson={lesson}
      lessonNavigation={lessonNavigation}
      nextLessonHref={
        nextLesson
          ? appendToken(`/course/logistics/basic/bonus/${nextLesson.slug}`, token)
          : undefined
      }
      previousLessonHref={
        previousLesson
          ? appendToken(
              `/course/logistics/basic/bonus/${previousLesson.slug}`,
              token,
            )
          : undefined
      }
    />
  );
}
