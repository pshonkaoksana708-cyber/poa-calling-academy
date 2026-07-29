"use client";

import { useEffect, useMemo, useState } from "react";
import type { Assessment } from "@/data/assessments/types";

type FinalProjectPageProps = {
  assessment: Assessment;
  backHref: string;
  nextHref?: string;
};

function storageKey(assessment: Assessment) {
  return `apr-project:${assessment.professionSlug}:${assessment.id}`;
}

export function FinalProjectPage({
  assessment,
  backHref,
  nextHref,
}: FinalProjectPageProps) {
  const sections = assessment.projectSections ?? [];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const key = useMemo(() => storageKey(assessment), [assessment]);

  useEffect(() => {
    const saved = window.localStorage.getItem(key);

    if (saved) {
      try {
        setChecked(JSON.parse(saved) as Record<string, boolean>);
      } catch {
        window.localStorage.removeItem(key);
      }
    }
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(checked));
  }, [checked, key]);

  function restart() {
    if (!window.confirm("Сбросить отмеченные пункты итогового проекта?")) {
      return;
    }

    setChecked({});
    window.localStorage.removeItem(key);
  }

  return (
    <main className="min-h-screen bg-porcelain py-10 font-sans text-ink md:py-16">
      <section className="container-shell">
        <a
          className="inline-flex items-center rounded-full border border-ink/15 bg-ivory px-5 py-3 text-sm font-semibold text-ink shadow-soft transition hover:border-gold hover:text-evergreen"
          href={backHref}
        >
          Вернуться к программе
        </a>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <article className="min-w-0 overflow-hidden rounded-[2rem] border border-ink/10 bg-ivory shadow-soft">
            <header className="border-b border-ink/10 bg-porcelain/70 p-6 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-gold">
                Итоговый проект
              </p>
              <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
                {assessment.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-ink/72 md:text-lg">
                {assessment.description}
              </p>
            </header>

            <div className="p-6 md:p-10">

            <div className="mt-8 grid gap-6">
              {sections.map((section, sectionIndex) => (
                <section
                  className="rounded-[1.75rem] border border-ink/10 bg-porcelain p-5 md:p-7"
                  key={`${section.id}-${sectionIndex}`}
                >
                  <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 grid gap-4">
                    {section.blocks.map((block, blockIndex) => (
                      <p
                        className="text-base leading-8 text-ink/74 md:text-lg md:leading-9"
                        key={`${section.id}-${blockIndex}`}
                      >
                        {block}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-8 rounded-[1.5rem] border border-gold/25 bg-gold/10 p-5 md:p-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                Самопроверка
              </p>
              <div className="grid gap-3">
                {[
                  "Я изучил(а) все требования к итоговому проекту.",
                  "Я подготовил(а) решение по всем обязательным этапам.",
                  "Я проверил(а) оформление и полноту результата.",
                  "Я понимаю, что проект требует ручной проверки.",
                ].map((item) => (
                  <label
                    className="flex cursor-pointer gap-3 rounded-2xl border border-ink/10 bg-ivory p-4 leading-7 text-ink/74 transition hover:border-gold/50 hover:bg-white"
                    key={item}
                  >
                    <input
                      checked={Boolean(checked[item])}
                      className="mt-1 h-5 w-5 accent-[var(--color-ink)]"
                      onChange={(event) =>
                        setChecked((current) => ({
                          ...current,
                          [item]: event.target.checked,
                        }))
                      }
                      type="checkbox"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </section>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <a
                className="rounded-full border border-ink/15 bg-ivory px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
                href={backHref}
              >
                Вернуться к аттестации
              </a>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-full border border-ink/15 bg-ivory px-7 py-4 text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
                  onClick={() => window.print()}
                  type="button"
                >
                  Распечатать задание
                </button>
                <button
                  className="rounded-full border border-ink/15 bg-ivory px-7 py-4 text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
                  onClick={restart}
                  type="button"
                >
                  Начать заново
                </button>
                {nextHref ? (
                  <a
                    className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                    href={nextHref}
                  >
                    Перейти к финальному экзамену
                  </a>
                ) : null}
              </div>
            </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft lg:sticky lg:top-8">
            <p className="text-sm font-semibold text-gold">Проверка проекта</p>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              На этапе MVP проект сохраняется как локальный прогресс на этом
              устройстве. Загрузка файлов и личный кабинет не подключаются.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
