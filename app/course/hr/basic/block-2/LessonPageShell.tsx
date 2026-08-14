import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/seo";
import { headers } from "next/headers";
import { supportEmail } from "@/data/config/email";
import {
  hrBlock2Lessons,
  hrBlock2LessonsByNumber,
} from "@/data/professions/hr/lessons-block-2";
import { validateAccessTokenForPrograms } from "@/lib/course-access";
import {
  appendToken,
  getHrAccessPlan,
  hrBlock2AccessKeys,
} from "../access";
import { LessonExperience } from "@/app/course/supply/basic/LessonExperience";

type LessonPageProps = {
  lessonNumber: number;
  searchParams: Promise<{
    token?: string;
  }>;
};

export function getHrBlock2LessonMetadata(lessonNumber: number): Metadata {
  const lesson = hrBlock2LessonsByNumber[lessonNumber];

  return {
    title: lesson
      ? `${lesson.professionTitle}: ${lesson.title}`
      : "Урок практического уровня",
    description: lesson
      ? `Урок ${lesson.lessonNumber} практического уровня образовательной программы «Специалист по кадрам и управлению персоналом».`
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
            Нет доступа к уроку
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            Материалы урока доступны только по защищенной ссылке после оплаты
            образовательной программы.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            Если вы уже оплатили программу, откройте ссылку из письма, которое
            пришло на ваш email.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href={appendToken("/course/hr/basic", token)}
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

export async function HrBlock2LessonPage({
  lessonNumber,
  searchParams,
}: LessonPageProps) {
  const lesson = hrBlock2LessonsByNumber[lessonNumber];
  const { token } = await searchParams;
  const access = validateAccessTokenForPrograms(token, hrBlock2AccessKeys);
  const localPreview = await isLocalLessonPreview();

  if (!lesson) {
    return <AccessDenied token={token} />;
  }

  if (!access.ok && (!localPreview || token)) {
    return <AccessDenied token={token} />;
  }

  const accessPlan = access.ok ? getHrAccessPlan(access.payload) : getHrAccessPlan();
  const displayLessonNumber = lesson.lessonNumber + 10;
  const displayTotalLessons = accessPlan === "practice" ? 20 : 30;
  const previousLessonHref =
    lesson.lessonNumber > 1
      ? appendToken(`/course/hr/basic/block-2/lesson-${lesson.lessonNumber - 1}`, token)
      : appendToken("/course/hr/basic/lesson-10", token);
  const nextLessonHref =
    lesson.lessonNumber < lesson.totalLessons
      ? appendToken(`/course/hr/basic/block-2/lesson-${lesson.lessonNumber + 1}`, token)
      : appendToken("/course/hr/basic/block-2-test", token);
  const nextLessonLabel =
    lesson.lessonNumber < lesson.totalLessons
      ? undefined
      : "Перейти к тесту Блока 2";
  const lessonNavigation = [...hrBlock2Lessons]
    .sort((first, second) => first.lessonNumber - second.lessonNumber)
    .map((item) => ({
      href: appendToken(`/course/hr/basic/block-2/lesson-${item.lessonNumber}`, token),
      displayNumber: item.lessonNumber + 10,
      lessonNumber: item.lessonNumber,
      title: item.title,
    }));

  return (
    <LessonExperience
      backHref={appendToken("/course/hr/basic", token)}
      displayLessonNumber={displayLessonNumber}
      displayTotalLessons={displayTotalLessons}
      lesson={lesson}
      lessonNavigation={lessonNavigation}
      nextLessonHref={nextLessonHref}
      nextLessonLabel={nextLessonLabel}
      previousLessonHref={previousLessonHref}
    />
  );
}
