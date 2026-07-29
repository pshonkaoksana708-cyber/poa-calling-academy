"use client";

import type {
  SupplyLessonPageData,
  SupplyLessonSection,
} from "@/data/professions/supply/basic-lessons";

type LessonNavigationItem = {
  displayNumber?: number;
  href: string;
  lessonNumber: number;
  title: string;
};

type LessonExperienceProps = {
  backHref: string;
  completionHref?: string;
  completionLabel?: string;
  displayLessonNumber?: number;
  displayTotalLessons?: number;
  lesson: SupplyLessonPageData;
  lessonNavigation: LessonNavigationItem[];
  nextLessonHref?: string;
  nextLessonLabel?: string;
  previousLessonHref?: string;
};

type PracticeAssignment = {
  title: string;
  condition: string[];
  steps: string[];
  example: string[];
};

function formatText(value: string) {
  return value
    .replace(/([.!?])(?=[А-ЯЁA-Z])/g, "$1 ")
    .replace(/([;:])(?=[0-9А-ЯЁA-Zа-яёa-z“«"])/g, "$1 ")
    .replace(/([”»"])(?=[А-ЯЁA-Z])/g, "$1 ")
    .replace(
      /([а-яё])(?=Если|Потому|Производство|Бухгалтерия|Склад|Подтвердили)/g,
      "$1 ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function isListItem(block: string) {
  const text = formatText(block);

  return (
    text.length <= 120 &&
    !text.includes("?") &&
    (!/[.!]$/.test(text) || text.endsWith(";"))
  );
}

function isTaskTitle(block: string) {
  return /^Задание\s+\d+\./.test(formatText(block));
}

function splitPracticeAssignments(blocks: string[]) {
  const assignments: Array<{ title: string; blocks: string[] }> = [];
  let current: { title: string; blocks: string[] } | null = null;

  for (const block of blocks) {
    if (isTaskTitle(block)) {
      if (current) {
        assignments.push(current);
      }

      current = { title: formatText(block), blocks: [] };
    } else if (current) {
      current.blocks.push(block);
    }
  }

  if (current) {
    assignments.push(current);
  }

  return assignments.map<PracticeAssignment>((assignment) => {
    const exampleStart = assignment.blocks.findIndex((block) =>
      formatText(block).toLowerCase().startsWith("пример"),
    );
    const content =
      exampleStart >= 0
        ? assignment.blocks.slice(0, exampleStart)
        : assignment.blocks;
    const example =
      exampleStart >= 0 ? assignment.blocks.slice(exampleStart) : [];

    return {
      title: assignment.title,
      condition: content.slice(0, 1),
      steps: content.slice(1),
      example,
    };
  });
}

function TextBlocks({ blocks }: { blocks: string[] }) {
  const groups = blocks.reduce<Array<{ type: "list" | "text"; items: string[] }>>(
    (result, block) => {
      const type = isListItem(block) ? "list" : "text";
      const last = result[result.length - 1];

      if (last?.type === type) {
        last.items.push(block);
      } else {
        result.push({ type, items: [block] });
      }

      return result;
    },
    [],
  );

  return (
    <div className="grid gap-5">
      {groups.map((group, index) =>
        group.type === "list" ? (
          <ul
            className="grid gap-2 rounded-2xl border border-ink/10 bg-porcelain p-5"
            key={`list-${index}`}
          >
            {group.items.map((item) => (
              <li className="flex gap-3 leading-7 text-ink/74" key={item}>
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{formatText(item)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid gap-4" key={`text-${index}`}>
            {group.items.map((item) => (
              <p
                className="text-base leading-8 text-ink/74 md:text-lg md:leading-9"
                key={item}
              >
                {formatText(item)}
              </p>
            ))}
          </div>
        ),
      )}
    </div>
  );
}

function ChecklistSection({ section }: { section: SupplyLessonSection }) {
  const intro = section.blocks[0];
  const finalText = section.blocks[section.blocks.length - 1];
  const items = section.blocks.slice(1, -1);

  return (
    <div className="grid gap-6">
      {intro ? (
        <p className="text-base leading-8 text-ink/74 md:text-lg md:leading-9">
          {formatText(intro)}
        </p>
      ) : null}
      <div className="grid gap-3">
        {items.map((item) => (
          <div
            className="flex gap-4 rounded-2xl border border-ink/10 bg-porcelain p-4 leading-7 text-ink/76"
            key={item}
          >
            <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/70 text-gold">
              ✓
            </span>
            <span>{formatText(item)}</span>
          </div>
        ))}
      </div>
      {finalText ? (
        <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5 font-semibold leading-7 text-ink">
          {formatText(finalText)}
        </div>
      ) : null}
    </div>
  );
}

function PracticeCards({ section }: { section: SupplyLessonSection }) {
  const assignments = splitPracticeAssignments(section.blocks);

  if (!assignments.length) {
    return <TextBlocks blocks={section.blocks} />;
  }

  return (
    <div className="grid gap-5">
      {assignments.map((assignment) => (
        <article
          className="rounded-[1.5rem] border border-ink/10 bg-porcelain p-5 md:p-6"
          key={assignment.title}
        >
          <h3 className="font-serif text-2xl leading-tight text-ink">
            {assignment.title}
          </h3>

          {assignment.condition.length ? (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Условие
              </p>
              <TextBlocks blocks={assignment.condition} />
            </div>
          ) : null}

          {assignment.steps.length ? (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Порядок выполнения
              </p>
              <TextBlocks blocks={assignment.steps} />
            </div>
          ) : null}

          {assignment.example.length ? (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Пример
              </p>
              <TextBlocks blocks={assignment.example} />
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function QuestionsBlock({ questions }: { questions: string[] }) {
  return (
    <ol className="grid gap-3">
      {questions.map((question, index) => (
        <li
          className="rounded-2xl border border-ink/10 bg-porcelain p-4 leading-7 text-ink/76"
          key={question}
        >
          <span className="mr-3 font-semibold text-gold">{index + 1}.</span>
          {formatText(question)}
        </li>
      ))}
    </ol>
  );
}

function SectionCard({
  eyebrow,
  section,
}: {
  eyebrow: string;
  section: SupplyLessonSection;
}) {
  const isChecklist = section.title.toLowerCase().includes("чек-лист");

  return (
    <section className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl leading-tight text-ink md:text-5xl">
        {section.title}
      </h2>
      <div className="mt-8">
        {isChecklist ? (
          <ChecklistSection section={section} />
        ) : (
          <TextBlocks blocks={section.blocks} />
        )}
      </div>
    </section>
  );
}

export function LessonExperience({
  backHref,
  completionHref,
  completionLabel,
  displayLessonNumber,
  displayTotalLessons,
  lesson,
  lessonNavigation,
  nextLessonHref,
  nextLessonLabel,
  previousLessonHref,
}: LessonExperienceProps) {
  const allContentSections = [
    ...(lesson.introSections ?? []),
    ...lesson.sections,
  ];
  const currentLessonNumber = displayLessonNumber ?? lesson.lessonNumber;
  const totalLessons = displayTotalLessons ?? lesson.totalLessons;
  const progress = (currentLessonNumber / totalLessons) * 100;
  const hasQuestions = lesson.questions.blocks.length > 0;

  return (
    <main className="min-h-screen bg-porcelain">
      <section className="border-b border-ink/10 bg-ivory/85 py-5 backdrop-blur">
        <div className="container-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
              {lesson.professionTitle}
            </p>
            <p className="mt-2 text-sm font-semibold text-ink/68">
              {lesson.levelTitle} / {lesson.blockTitle}
            </p>
          </div>
          <a
            className="inline-flex rounded-full border border-ink/15 px-5 py-3 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
            href={backHref}
          >
            Вернуться к программе уровня
          </a>
        </div>
      </section>

      <section className="pb-12 pt-10 md:pb-16 md:pt-14">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="min-w-0">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-gold">
                Урок {currentLessonNumber}
              </p>
              <h1 className="max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
                {lesson.title}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-ink/76">
                Один урок соответствует одному исходному DOCX-файлу. Материал
                расположен на странице целиком и изучается сверху вниз.
              </p>
            </div>

            <aside className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft">
              <p className="text-sm font-semibold text-gold">Прогресс пакета</p>
              <p className="mt-3 font-serif text-3xl leading-tight text-ink">
                Урок {currentLessonNumber} из {totalLessons}
              </p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-5 text-sm leading-6 text-ink/68">
                {lesson.blockTitle}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-shell grid gap-8 lg:grid-cols-[300px_minmax(0,760px)] lg:items-start lg:justify-center">
          <aside className="rounded-3xl border border-ink/10 bg-ivory p-5 shadow-soft lg:sticky lg:top-8">
            <p className="px-2 text-sm font-semibold text-gold">
              Уроки блока
            </p>
            <ol className="mt-5 grid gap-2 text-sm leading-6">
              {lessonNavigation.map((item) => {
                const isCurrent = item.lessonNumber === lesson.lessonNumber;

                return (
                  <li key={item.lessonNumber}>
                    <a
                      className={`flex w-full min-w-0 items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        isCurrent
                          ? "bg-ink text-white"
                          : "text-ink/74 hover:bg-porcelain hover:text-ink"
                      }`}
                      href={item.href}
                    >
                      <span
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.7rem] ${
                          isCurrent
                            ? "border-gold text-gold"
                            : "border-ink/20 text-ink/50"
                        }`}
                      >
                        {item.lessonNumber}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] opacity-70">
                          Урок {item.displayNumber ?? item.lessonNumber}
                        </span>
                        <span className="mt-1 block [hyphens:auto] [overflow-wrap:anywhere]">
                          {item.title}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </aside>

          <div className="grid min-w-0 gap-6">
            <section className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                {lesson.goalHeading ?? "Цель урока"}
              </p>
              <TextBlocks blocks={lesson.goal} />
            </section>

            {lesson.mainIdea ? (
              <section className="rounded-[2rem] border border-ink/10 bg-ink p-6 text-white shadow-soft md:p-8">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                  Главная мысль
                </p>
                <p className="font-serif text-3xl leading-tight md:text-4xl">
                  {formatText(lesson.mainIdea)}
                </p>
              </section>
            ) : null}

            {allContentSections.map((section) => (
              <SectionCard
                eyebrow={`Раздел ${section.number}`}
                key={`${section.number}-${section.title}`}
                section={section}
              />
            ))}

            <section className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                Практика
              </p>
              <h2 className="font-serif text-3xl leading-tight text-ink md:text-5xl">
                {lesson.practice.title}
              </h2>
              <div className="mt-8">
                <PracticeCards section={lesson.practice} />
              </div>
            </section>

            {(lesson.postPracticeSections ?? []).map((section) => (
              <SectionCard
                eyebrow={`Раздел ${section.number}`}
                key={`${section.number}-${section.title}`}
                section={section}
              />
            ))}

            {hasQuestions ? (
              <section className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                  Проверка
                </p>
                <h2 className="font-serif text-3xl leading-tight text-ink md:text-5xl">
                  {lesson.questions.title}
                </h2>
                <div className="mt-8">
                  <QuestionsBlock questions={lesson.questions.blocks} />
                </div>
              </section>
            ) : null}

            <section className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                Финал
              </p>
              <h2 className="font-serif text-3xl leading-tight text-ink md:text-5xl">
                {lesson.summary.title}
              </h2>
              <div className="mt-8 grid gap-6">
                <TextBlocks blocks={lesson.summary.blocks} />
                <section className="rounded-[2rem] border border-evergreen/20 bg-ivory p-6 shadow-soft md:p-8">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                    Что важно запомнить
                  </p>
                  <ul className="grid gap-3">
                    {lesson.keyTakeaways.map((item) => (
                      <li className="flex gap-3 leading-7 text-ink/76" key={item}>
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{formatText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </section>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {previousLessonHref ? (
                <a
                  className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
                  href={previousLessonHref}
                >
                  Предыдущий урок
                </a>
              ) : (
                <a
                  className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
                  href={backHref}
                >
                  Вернуться к программе
                </a>
              )}

              {nextLessonHref ? (
                <a
                  className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                  href={nextLessonHref}
                >
                  {nextLessonLabel ?? "Следующий урок"}
                </a>
              ) : (
                <a
                  className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                  href={completionHref ?? backHref}
                >
                  {completionLabel ?? "Завершить блок"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
