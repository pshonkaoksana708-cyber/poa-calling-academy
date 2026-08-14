import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AccessBlock,
  Certificate,
  Checklist,
  EditorialImage,
  InteractiveQuiz,
  LessonCard,
  ModuleCard,
  PracticeBlock,
  Quote,
  ResultCard,
} from "@/components";
import { accessDeliverySteps, supportEmail } from "@/data/config/email";
import { getSupplyLevelImage } from "@/data/images";
import { getAllowedAccessKeysForLevel, getProfessionLevel } from "@/data/professions";
import {
  getSupplyAccessibleBlockCount,
  supplyBlock1AccessKeys,
} from "@/app/course/supply/basic/access";
import { validateAccessTokenForPrograms } from "@/lib/course-access";
import { publicSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

type CourseLevelPageProps = {
  params: Promise<{
    slug: string;
    level: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

const accessReasonText = {
  missing: "Ссылка доступа не содержит token.",
  malformed: "Token имеет некорректный формат.",
  invalid_signature: "Token не прошел проверку подлинности.",
  expired: "Срок действия ссылки доступа истек.",
  wrong_program: "Token выпущен для другого уровня профессии.",
};

const supplyBasicPackages = [
  {
    title: "Базовый уровень",
    stats: "1 блок / 10 уроков",
    description: "Блок 1. Основы профессии специалиста по снабжению.",
    href: "/course/supply/basic/lesson-1",
  },
  {
    title: "Практический уровень",
    stats: "2 блока / 20 уроков",
    description:
      "Блок 1. Основы профессии специалиста по снабжению. Блок 2. Управление закупками и поставщиками.",
    href: "/course/supply/basic/lesson-1",
  },
  {
    title: "Профессиональный уровень",
    stats: "3 блока / 30 уроков",
    description:
      "Блок 1. Основы профессии специалиста по снабжению. Блок 2. Управление закупками и поставщиками. Блок 3. Контроль, аналитика и эффективность.",
    href: "/course/supply/basic/lesson-1",
  },
];

const hrBasicPackages = [
  {
    title: "Базовый уровень",
    stats: "1 блок / 10 уроков",
    description: "Блок 1. Начальный уровень: основы профессии и первые задачи.",
    href: "/course/hr/basic/lesson-1",
  },
  {
    title: "Практический уровень",
    stats: "2 блока / 20 уроков",
    description:
      "Блок 1. Начальный уровень. Блок 2. Практический уровень: интервью, оценка кандидатов, HR-аналитика и коммуникация.",
    href: "/course/hr/basic/lesson-1",
  },
  {
    title: "Профессиональный уровень",
    stats: "3 блока / 30 уроков",
    description:
      "Блок 1. Начальный уровень. Блок 2. Практический уровень. Блок 3. Профессиональный уровень: адаптация, развитие, культура и HR-стратегия.",
    href: "/course/hr/basic/lesson-1",
  },
];

const tourismBasicPackages = [
  {
    title: "Базовый уровень",
    stats: "1 блок / 10 уроков",
    description:
      "Блок 1. Базовый уровень: основы профессии, туристическая отрасль, направления, продукты, размещение, документы и логистика.",
    href: "/course/tourism/basic/lesson-1",
  },
  {
    title: "Практический уровень",
    stats: "2 блока / 20 уроков",
    description:
      "Блок 1. Базовый уровень. Блок 2. Практический уровень: консультация клиента, подбор направления, работа с туроператорами и подготовка предложения.",
    href: "/course/tourism/basic/lesson-1",
  },
  {
    title: "Профессиональный уровень",
    stats: "3 блока / 30 уроков",
    description:
      "Блок 1. Базовый уровень. Блок 2. Практический уровень. Блок 3. Профессиональный уровень: индивидуальные маршруты, переговоры, сложные ситуации, сервис и продвижение.",
    href: "/course/tourism/basic/lesson-1",
  },
];

const logisticsBasicPackages = [
  {
    title: "Базовый уровень",
    stats: "1 блок / 10 уроков",
    description:
      "Блок 1. Основы международной логистики: участники перевозки, маршруты, документы, сроки и контроль процесса.",
    href: "/course/logistics/basic/lesson-1",
  },
  {
    title: "Практический уровень",
    stats: "2 блока / 20 уроков",
    description:
      "Блок 1. Основы международной логистики. Блок 2. Практика перевозок, документов, коммуникации и контроля сроков.",
    href: "/course/logistics/basic/lesson-1",
  },
  {
    title: "Профессиональный уровень",
    stats: "3 блока / 30 уроков",
    description:
      "Блок 1. Основы международной логистики. Блок 2. Практика перевозок и документов. Блок 3. Контроль, аналитика и управление процессами.",
    href: "/course/logistics/basic/lesson-1",
  },
];

const aiBasicPackages = [
  {
    title: "Базовый уровень",
    stats: "1 блок / 10 уроков",
    description:
      "Блок 1. Фундамент AI и профессиональная работа с нейросетями.",
    href: "/course/ai/basic/lesson-1",
  },
  {
    title: "Практический уровень",
    stats: "2 блока / 20 уроков",
    description:
      "Блок 1. Фундамент AI и профессиональная работа с нейросетями. Блок 2. Практическое применение AI в профессиях и бизнесе.",
    href: "/course/ai/basic/lesson-1",
  },
  {
    title: "Профессиональный уровень",
    stats: "3 блока / 30 уроков",
    description:
      "Блок 1. Фундамент AI. Блок 2. Практическое применение AI. Блок 3. Профессия AI-специалиста и внедрение AI.",
    href: "/course/ai/basic/lesson-1",
  },
];

type CourseOverviewPackage = {
  title: string;
  stats: string;
  description: string;
  href: string;
  ctaLabel?: string;
};

function withToken(href: string, token?: string) {
  if (!token) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";

  return `${href}${separator}token=${encodeURIComponent(token)}`;
}

function CourseProgramOverviewPage({
  packages,
  professionHref,
  professionTitle,
  token,
  visiblePackageCount,
}: {
  packages: CourseOverviewPackage[];
  professionHref: string;
  professionTitle: string;
  token?: string;
  visiblePackageCount?: number;
}) {
  const visiblePackages =
    visiblePackageCount === undefined
      ? packages
      : packages.slice(0, visiblePackageCount);
  const visibleBlockCount = visiblePackageCount ?? 3;
  const visibleLessonCount = visibleBlockCount * 10;

  return (
    <main className="min-h-screen bg-porcelain">
      <section className="pb-14 pt-12 md:pb-20 md:pt-16">
        <div className="container-shell">
          <a
            className="text-sm font-semibold text-ink/70 transition hover:text-ink"
            href={professionHref}
          >
            Вернуться к профессии
          </a>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="min-w-0">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-gold">
                {professionTitle}
              </p>
              <h1 className="max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
                Базовый уровень
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
                Уровни доступа устроены накопительно: базовый пакет открывает
                первый блок, практический пакет включает первые два блока, а
                профессиональный пакет открывает всю траекторию из трех блоков.
              </p>
            </div>

            <aside className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft">
              <p className="text-sm font-semibold text-gold">Структура программы</p>
              <dl className="mt-5 grid gap-4">
                <div className="rounded-2xl border border-ink/10 bg-porcelain p-4">
                  <dt className="text-sm text-ink/60">Всего в программе</dt>
                  <dd className="mt-1 font-serif text-3xl leading-tight text-ink">
                    {visibleBlockCount} {visibleBlockCount === 1 ? "блок" : "блока"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-porcelain p-4">
                  <dt className="text-sm text-ink/60">Уроки</dt>
                  <dd className="mt-1 font-serif text-3xl leading-tight text-ink">
                    {visibleLessonCount} уроков
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-3">
            {visiblePackages.map((item, index) => (
              <article
                className="flex min-w-0 flex-col rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8"
                key={item.title}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 font-serif text-2xl text-ink">
                    {index + 1}
                  </span>
                  <span className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/58">
                    {item.stats}
                  </span>
                </div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                  Уровень доступа
                </p>
                <h2 className="mt-4 font-serif text-3xl leading-tight text-ink [hyphens:auto] [overflow-wrap:anywhere]">
                  {item.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-ink/68">
                  {item.description}
                </p>
                <div className="mt-8 flex flex-1 items-end">
                  <a
                    className="inline-flex w-full justify-center rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                    href={withToken(item.href, token)}
                  >
                    {item.ctaLabel ?? "Перейти к материалам"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: CourseLevelPageProps): Promise<Metadata> {
  const { slug, level } = await params;
  const data = getProfessionLevel(slug, level);

  return {
    ...(data ? publicSeo(`/course/${slug}/${level}`) : {}),
    title: data
      ? `${data.profession.title}: ${data.level.title}`
      : "Уровень образовательной программы",
    description: data?.level.description,
  };
}

export default async function CourseLevelPage({
  params,
  searchParams,
}: CourseLevelPageProps) {
  const { slug: professionSlug, level: levelSlug } = await params;
  const { token } = await searchParams;
  const data = getProfessionLevel(professionSlug, levelSlug);

  if (!data) {
    notFound();
  }

  const { profession, level } = data;
  const allowedAccessKeys = getAllowedAccessKeysForLevel(profession.slug, level.slug);
  const access = validateAccessTokenForPrograms(token, allowedAccessKeys);
  const lessonCount = level.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
  const levelChecklist = level.checklist?.map((item) => item.text) ?? [
    ...level.learningResult.skills,
    ...level.learningResult.tasks,
  ];
  const levelQuote = level.quote ?? {
    author: "POA CALLING — Академия профессионального развития",
    role: "Подход к материалам",
    text:
      "Главная задача уровня — дать понятную структуру, рабочие примеры и практические действия, которые можно перенести в реальные профессиональные задачи.",
  };
  const levelImage = getSupplyLevelImage(level.slug);

  if (profession.slug === "supply" && level.slug === "basic") {
    const supplyAccess = validateAccessTokenForPrograms(
      token,
      supplyBlock1AccessKeys,
    );

    if (token && !supplyAccess.ok) {
      return (
        <main className="min-h-screen bg-porcelain py-16 md:py-24">
          <section className="container-shell">
            <div className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
                Защищенный доступ
              </p>
              <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
                Нет доступа
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
                Защищенная ссылка не подходит для этой образовательной
                программы или срок ее действия истек.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                  href="/profession/supply"
                >
                  Вернуться к профессии
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

    return (
      <CourseProgramOverviewPage
        packages={supplyBasicPackages}
        professionHref="/profession/supply"
        professionTitle="Специалист по снабжению"
        token={token}
        visiblePackageCount={
          supplyAccess.ok
            ? getSupplyAccessibleBlockCount(supplyAccess.payload)
            : undefined
        }
      />
    );
  }

  if (profession.slug === "hr" && level.slug === "basic") {
    return (
      <CourseProgramOverviewPage
        packages={hrBasicPackages}
        professionHref="/profession/hr"
        professionTitle="Специалист по кадрам и управлению персоналом"
        token={token}
      />
    );
  }

  if (profession.slug === "tourism" && level.slug === "basic") {
    return (
      <CourseProgramOverviewPage
        packages={tourismBasicPackages}
        professionHref="/profession/tourism"
        professionTitle="Специалист по туризму"
        token={token}
      />
    );
  }

  if (profession.slug === "logistics" && level.slug === "basic") {
    return (
      <CourseProgramOverviewPage
        packages={logisticsBasicPackages}
        professionHref="/profession/logistics"
        professionTitle="Специалист по международной логистике"
        token={token}
      />
    );
  }

  if (profession.slug === "ai" && level.slug === "basic") {
    return (
      <CourseProgramOverviewPage
        packages={aiBasicPackages}
        professionHref="/profession/ai"
        professionTitle="Специалист по искусственному интеллекту"
        token={token}
      />
    );
  }

  if (!access.ok) {
    return (
      <main className="min-h-screen bg-porcelain py-16 md:py-24">
        <section className="container-shell">
          <div className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              Protected access
            </p>
            <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
              Нет доступа
            </h1>
            <EditorialImage
              alt={`${profession.title}: ${level.title}`}
              aspect="wide"
              className="mt-8 shadow-none"
              icon="briefcase"
              label="Визуал материалов образовательной программы"
              src={levelImage}
            />
            <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
              Материалы этой образовательной программы доступны только по
              защищенной ссылке после оплаты.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
              Если вы уже оплатили программу, откройте ссылку из письма,
              которое пришло на ваш email.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
              Если письмо не пришло в течение 10 минут, проверьте папку Спам
              или свяжитесь с нами.
            </p>
            <div className="mt-8 rounded-2xl border border-gold/30 bg-porcelain p-5 text-sm leading-7 text-ink/72">
              <p className="font-semibold text-ink">
                Причина: {accessReasonText[access.reason]}
              </p>
              <p className="mt-2">
                Защищенная ссылка должна совпадать с выбранной образовательной
                программой и быть действительной по сроку доступа.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                href={`/profession/${profession.slug}`}
              >
                Выбрать программу
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

  return (
    <main className="min-h-screen bg-porcelain">
      <section className="pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="container-shell">
          <a
            className="text-sm font-semibold text-ink/70 transition hover:text-ink"
            href={`/profession/${profession.slug}`}
          >
            Вернуться к профессии
          </a>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="min-w-0">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-gold">
                {profession.title} / {level.label}
              </p>
              <h1 className="max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
                {level.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
                {level.description}
              </p>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-ink">
                {level.result}
              </p>
            </div>

            <aside className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft">
              <EditorialImage
                alt={`${profession.title}: ${level.title}`}
                aspect="wide"
                className="mb-6 shadow-none"
                icon="briefcase"
                label="Визуал материалов образовательной программы"
                sizes="360px"
                src={levelImage}
              />
              <p className="text-sm font-semibold text-gold">Доступ подтвержден</p>
              <dl className="mt-5 grid gap-4 text-sm text-ink/70">
                <div>
                  <dt className="font-semibold text-ink">Email</dt>
                  <dd className="break-words">{access.payload.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Профессия</dt>
                  <dd>{profession.title}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Уровень</dt>
                  <dd>{level.title}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Доступ действует до</dt>
                  <dd>
                    {new Intl.DateTimeFormat("ru-RU", {
                      dateStyle: "long",
                    }).format(new Date(access.payload.expiresAt * 1000))}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-space bg-ink text-white">
        <div className="container-shell grid gap-5 md:grid-cols-4">
          <article className="rounded-3xl border border-white/12 bg-white/[0.04] p-7">
            <p className="text-sm text-white/60">Длительность</p>
            <p className="mt-2 text-2xl font-semibold">{level.duration}</p>
          </article>
          <article className="rounded-3xl border border-white/12 bg-white/[0.04] p-7">
            <p className="text-sm text-white/60">Модули</p>
            <p className="mt-2 text-2xl font-semibold">{level.modules.length}</p>
          </article>
          <article className="rounded-3xl border border-white/12 bg-white/[0.04] p-7">
            <p className="text-sm text-white/60">Уроки</p>
            <p className="mt-2 text-2xl font-semibold">{lessonCount}</p>
          </article>
          <article className="rounded-3xl border border-white/12 bg-white/[0.04] p-7">
            <p className="text-sm text-white/60">Формат</p>
            <p className="mt-2 text-2xl font-semibold">Материалы</p>
          </article>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <Quote
            author={levelQuote.author}
            role={levelQuote.role}
            text={levelQuote.text}
          />
        </div>
      </section>

      <section className="section-space bg-ivory/55">
        <div className="container-shell">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              Outcome
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Итог уровня
            </h2>
            {level.finalSummary ? (
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink/68">
                {level.finalSummary}
              </p>
            ) : null}
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <ResultCard items={level.learningResult.skills} title="Навыки" />
            <ResultCard items={level.learningResult.tasks} title="Практические задачи" />
            <ResultCard items={level.learningResult.workplaces} title="Где применять" />
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-gold">Структура материалов</p>
            <ol className="mt-5 grid gap-3 text-sm text-ink/70">
              {level.modules.map((module, moduleIndex) => (
                <li key={module.id}>
                  <p className="font-semibold text-ink">
                    {moduleIndex + 1}. {module.title}
                  </p>
                  <p className="mt-1">{module.lessons.length} урок(а)</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-2xl border border-gold/30 bg-porcelain p-4 text-sm leading-6 text-ink/68">
              Модули и уроки помогают ориентироваться в материалах
              образовательной программы и возвращаться к нужным темам в удобном
              темпе.
            </p>
          </aside>

          <div className="grid gap-8">
            {level.modules.map((module, moduleIndex) => (
              <article className="grid gap-5" key={module.id}>
                <ModuleCard
                  description={module.description}
                  index={moduleIndex + 1}
                  lessonCount={module.lessons.length}
                  title={module.title}
                />

                <div className="grid gap-4">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <LessonCard
                      duration={lesson.duration}
                      index={lessonIndex + 1}
                      key={lesson.id}
                      title={lesson.title}
                    >
                      {lesson.structuredContent ? (
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            {lesson.structuredContent.intro.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>

                          <div className="rounded-2xl border border-ink/10 bg-ivory p-5">
                            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
                              После изучения темы вы сможете
                            </p>
                            <Checklist items={lesson.structuredContent.outcomes} />
                          </div>

                          <div className="rounded-2xl border border-ink/10 bg-ivory p-5">
                            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
                              Что изучим
                            </p>
                            <Checklist items={lesson.structuredContent.studyPlan} />
                          </div>

                          <Quote
                            author="Автор образовательных программ"
                            role="Совет автора"
                            text={lesson.structuredContent.authorAdvice}
                          />
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {lesson.content.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      )}

                      {lesson.practiceAssignments?.map((assignment) => (
                        <div className="mt-5" key={assignment.id}>
                          <PracticeBlock title={assignment.title}>
                            {assignment.description}
                          </PracticeBlock>
                        </div>
                      ))}
                      {!lesson.practiceAssignments?.length && lesson.practice ? (
                        <div className="mt-5">
                          <PracticeBlock>{lesson.practice}</PracticeBlock>
                        </div>
                      ) : null}
                      {lesson.checklist?.length ? (
                        <div className="mt-5">
                          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
                            Чек-лист урока
                          </p>
                          <Checklist items={lesson.checklist.map((item) => item.text)} />
                        </div>
                      ) : null}
                      {lesson.additionalMaterials?.length ? (
                        <div className="mt-5 rounded-2xl border border-ink/10 bg-ivory p-5">
                          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
                            Дополнительные материалы
                          </p>
                          <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink/70">
                            {lesson.additionalMaterials.map((material) => (
                              <li className="border-t border-ink/10 pt-3" key={material.id}>
                                <span className="font-semibold text-ink">
                                  {material.title}
                                </span>
                                <span className="mt-1 block">
                                  {material.description}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {lesson.structuredContent ? (
                        <div className="mt-5">
                          <ResultCard
                            items={lesson.structuredContent.summary}
                            title="Итоги темы"
                          />
                        </div>
                      ) : null}
                    </LessonCard>
                  ))}
                </div>

                {module.completedItems?.length ? (
                  <div className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
                      Module result
                    </p>
                    <h2 className="font-serif text-4xl leading-tight text-ink">
                      {module.completedTitle ?? "Что вы освоили после блока"}
                    </h2>
                    <div className="mt-6">
                      <Checklist items={module.completedItems} />
                    </div>
                  </div>
                ) : null}

                {module.finalQuiz ? (
                  <InteractiveQuiz quiz={module.finalQuiz} />
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-ivory/55">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              Checklist
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Проверьте себя после уровня
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-ink/68">
              Этот чек-лист помогает понять, какие действия вы уже можете
              выполнять самостоятельно после изучения материалов.
            </p>
            <EditorialImage
              alt="Чек-листы и конспекты образовательной программы"
              aspect="wide"
              className="mt-8 shadow-none"
              icon="spark"
              label="Визуал чек-листов и конспектов"
              src={levelImage}
            />
          </div>
          <Checklist items={levelChecklist} />
        </div>
      </section>

      {level.additionalMaterials?.length ? (
        <section className="section-space">
          <div className="container-shell">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
                Materials
              </p>
              <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
                Дополнительные материалы уровня
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink/68">
                Эти материалы помогают перенести обучение в рабочие документы:
                таблицы, шаблоны, примеры и чек-листы.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {level.additionalMaterials.map((material) => (
                <article
                  className="rounded-3xl border border-ink/10 bg-ivory p-7 shadow-soft"
                  key={material.id}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                    {material.format}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl leading-tight text-ink">
                    {material.title}
                  </h3>
                  <p className="mt-4 leading-7 text-ink/68">
                    {material.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Certificate
            programTitle={`${profession.title}: ${level.title}`}
            recipient="После завершения уровня"
          />
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              Certificate
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Электронный сертификат после завершения
            </h2>
            <p className="mt-6 leading-8 text-ink/70">
              Сертификат фиксирует прохождение уровня образовательной программы
              и отражает выбранное направление подготовки. Реальные данные
              ученика и дата завершения будут подставляться в дальнейшем.
            </p>
            <EditorialImage
              alt="Финальный экран образовательной программы"
              aspect="wide"
              className="mt-8 shadow-none"
              icon="spark"
              label="Финальный визуал образовательной программы"
              src={levelImage}
            />
          </div>
        </div>
      </section>

      <section className="section-space bg-ivory/55">
        <div className="container-shell">
          <AccessBlock
            description="Этот уровень открыт по защищенной ссылке из письма. Сохраните письмо, чтобы быстро вернуться к материалам образовательной программы."
            steps={accessDeliverySteps}
            title="Как работает доступ к материалам"
          />
        </div>
      </section>
    </main>
  );
}
