import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/seo";
import { headers } from "next/headers";
import { supportEmail } from "@/data/config/email";
import {
  supplyBasicBlock3Lessons,
  supplyBasicBlock3LessonsByNumber,
} from "@/data/professions/supply/basic-block-3-lessons";
import { validateAccessTokenForPrograms } from "@/lib/course-access";
import { appendToken, supplyBlock3AccessKeys } from "../access";
import { LessonExperience } from "../LessonExperience";

type LessonPageProps = {
  lessonNumber: number;
  searchParams: Promise<{
    token?: string;
  }>;
};

export function getSupplyBasicBlock3LessonMetadata(
  lessonNumber: number,
): Metadata {
  const lesson = supplyBasicBlock3LessonsByNumber[lessonNumber];

  return {
    title: lesson
      ? `${lesson.professionTitle}: ${lesson.title}`
      : "Урок базового уровня",
    description: lesson
      ? `Урок ${lesson.lessonNumber} третьего блока базового уровня образовательной программы «Специалист по снабжению».`
      : undefined,
    robots: noIndexRobots,
  };
}

function withToken(href: string, token?: string) {
  return appendToken(href, token);
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
            Этот уровень не входит в приобретённый пакет
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            Блок 3 доступен только в профессиональном пакете. Материалы блоков
            выше оплаченного пакета не раскрываются.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            Если вы уже оплатили программу, откройте ссылку из письма, которое
            пришло на ваш email.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href={withToken("/course/supply/basic", token)}
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

export async function SupplyBasicBlock3LessonPage({
  lessonNumber,
  searchParams,
}: LessonPageProps) {
  const lesson = supplyBasicBlock3LessonsByNumber[lessonNumber];
  const { token } = await searchParams;
  const access = validateAccessTokenForPrograms(token, supplyBlock3AccessKeys);
  const localPreview = await isLocalLessonPreview();

  if (!lesson) {
    return <AccessDenied token={token} />;
  }

  if (!access.ok && (!localPreview || token)) {
    return <AccessDenied token={token} />;
  }

  const displayLessonNumber = lesson.lessonNumber + 20;
  const previousLessonHref =
    lesson.lessonNumber > 1
      ? withToken(
          `/course/supply/basic/block-3/lesson-${lesson.lessonNumber - 1}`,
          token,
        )
      : withToken("/course/supply/basic/block-2/lesson-10", token);
  const nextLessonHref =
    lesson.lessonNumber < lesson.totalLessons
      ? withToken(
          `/course/supply/basic/block-3/lesson-${lesson.lessonNumber + 1}`,
          token,
        )
      : withToken("/course/supply/basic/block-3-test", token);
  const nextLessonLabel =
    lesson.lessonNumber < lesson.totalLessons
      ? undefined
      : "Перейти к тесту Блока 3";
  const lessonNavigation = [...supplyBasicBlock3Lessons]
    .sort((first, second) => first.lessonNumber - second.lessonNumber)
    .map((item) => ({
      href: withToken(
        `/course/supply/basic/block-3/lesson-${item.lessonNumber}`,
        token,
      ),
      displayNumber: item.lessonNumber + 20,
      lessonNumber: item.lessonNumber,
      title: item.title,
    }));

  return (
    <LessonExperience
      backHref={withToken("/course/supply/basic", token)}
      displayLessonNumber={displayLessonNumber}
      displayTotalLessons={30}
      lesson={lesson}
      lessonNavigation={lessonNavigation}
      nextLessonHref={nextLessonHref}
      nextLessonLabel={nextLessonLabel}
      previousLessonHref={previousLessonHref}
    />
  );
}
