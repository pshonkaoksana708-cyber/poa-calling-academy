import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/seo";
import { headers } from "next/headers";
import { supportEmail } from "@/data/config/email";
import {
  aiBlock1Lessons,
  aiBlock1LessonsByNumber,
} from "@/data/professions/ai/lessons-block-1";
import { validateAccessTokenForPrograms } from "@/lib/course-access";
import { appendToken, getAiAccessPlan, aiBlock1AccessKeys } from "./access";
import { LessonExperience } from "@/app/course/supply/basic/LessonExperience";

type LessonPageProps = {
  lessonNumber: number;
  searchParams: Promise<{
    token?: string;
  }>;
};

export function getAiBlock1LessonMetadata(lessonNumber: number): Metadata {
  const lesson = aiBlock1LessonsByNumber[lessonNumber];

  return {
    title: lesson
      ? `${lesson.professionTitle}: ${lesson.title}`
      : "Урок базового уровня",
    description: lesson
      ? `Урок ${lesson.lessonNumber} базового уровня образовательной программы «Специалист по искусственному интеллекту».`
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
              href={appendToken("/course/ai/basic", token)}
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

export async function AiBlock1LessonPage({
  lessonNumber,
  searchParams,
}: LessonPageProps) {
  const lesson = aiBlock1LessonsByNumber[lessonNumber];
  const { token } = await searchParams;
  const access = validateAccessTokenForPrograms(token, aiBlock1AccessKeys);
  const localPreview = await isLocalLessonPreview();

  if (!lesson) {
    return <AccessDenied token={token} />;
  }

  if (!access.ok && (!localPreview || token)) {
    return <AccessDenied token={token} />;
  }

  const accessPlan = access.ok ? getAiAccessPlan(access.payload) : getAiAccessPlan();
  const displayTotalLessons =
    accessPlan === "basic" ? 10 : accessPlan === "practice" ? 20 : 30;
  const previousLessonHref =
    lesson.lessonNumber > 1
      ? appendToken(`/course/ai/basic/lesson-${lesson.lessonNumber - 1}`, token)
      : undefined;
  const nextLessonHref =
    lesson.lessonNumber < lesson.totalLessons
      ? appendToken(`/course/ai/basic/lesson-${lesson.lessonNumber + 1}`, token)
      : appendToken("/course/ai/basic/block-1-test", token);
  const nextLessonLabel =
    lesson.lessonNumber < lesson.totalLessons
      ? undefined
      : "Перейти к тесту Блока 1";
  const lessonNavigation = [...aiBlock1Lessons]
    .sort((first, second) => first.lessonNumber - second.lessonNumber)
    .map((item) => ({
      href: appendToken(`/course/ai/basic/lesson-${item.lessonNumber}`, token),
      lessonNumber: item.lessonNumber,
      title: item.title,
    }));

  return (
    <LessonExperience
      backHref={appendToken("/course/ai/basic", token)}
      displayLessonNumber={lesson.lessonNumber}
      displayTotalLessons={displayTotalLessons}
      lesson={lesson}
      lessonNavigation={lessonNavigation}
      nextLessonHref={nextLessonHref}
      nextLessonLabel={nextLessonLabel}
      previousLessonHref={previousLessonHref}
    />
  );
}
