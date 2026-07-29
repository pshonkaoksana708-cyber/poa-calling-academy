"use client";

import { useMemo, useState } from "react";
import type { EducationalQuiz } from "@/data/professions/types";
import { cn } from "@/lib/utils";

type InteractiveQuizProps = {
  quiz: EducationalQuiz;
};

export function InteractiveQuiz({ quiz }: InteractiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.id];
  const progress = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);
  const score = useMemo(
    () =>
      quiz.questions.reduce((total, question) => {
        const selected = question.options.find(
          (option) => option.id === answers[question.id],
        );

        return selected?.isCorrect ? total + 1 : total;
      }, 0),
    [answers, quiz.questions],
  );

  function selectOption(optionId: string) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: optionId,
    }));
  }

  function goNext() {
    if (currentIndex === quiz.questions.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((current) => current + 1);
  }

  function goBack() {
    if (isFinished) {
      setIsFinished(false);
      return;
    }

    setCurrentIndex((current) => Math.max(0, current - 1));
  }

  function restart() {
    setAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  }

  if (isFinished) {
    return (
      <section className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
          Result
        </p>
        <h3 className="font-serif text-4xl leading-tight text-ink">
          Результат теста
        </h3>
        <p className="mt-5 text-xl leading-8 text-ink">
          {score} из {quiz.questions.length} правильных ответов
        </p>
        <p className="mt-4 max-w-2xl leading-8 text-ink/68">
          Если результат пока не идеальный, вернитесь к темам первого блока и
          повторите ключевые понятия: роль снабжения, закупочный цикл, критерии
          выбора и фиксацию требований.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-evergreen"
            onClick={restart}
            type="button"
          >
            Пройти еще раз
          </button>
          <button
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-bold text-ink transition hover:border-gold hover:text-evergreen"
            onClick={goBack}
            type="button"
          >
            Вернуться к вопросам
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Final test
          </p>
          <h3 className="font-serif text-4xl leading-tight text-ink">
            {quiz.title}
          </h3>
          <p className="mt-4 max-w-2xl leading-8 text-ink/68">
            {quiz.description}
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-porcelain px-4 py-3 text-sm font-semibold text-ink/70">
          {currentIndex + 1} / {quiz.questions.length}
        </div>
      </div>

      <div className="mt-8 h-2 overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-gold transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8">
        <h4 className="font-serif text-3xl leading-tight text-ink">
          {currentQuestion.question}
        </h4>

        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <button
                className={cn(
                  "rounded-2xl border p-5 text-left leading-7 transition",
                  isSelected
                    ? "border-gold bg-porcelain text-ink shadow-soft"
                    : "border-ink/10 bg-white text-ink/72 hover:border-gold/60 hover:bg-porcelain",
                )}
                key={option.id}
                onClick={() => selectOption(option.id)}
                type="button"
              >
                {option.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          className="rounded-full border border-ink/15 px-6 py-3 text-sm font-bold text-ink transition hover:border-gold hover:text-evergreen disabled:cursor-not-allowed disabled:opacity-45"
          disabled={currentIndex === 0}
          onClick={goBack}
          type="button"
        >
          Назад
        </button>
        <button
          className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-evergreen disabled:cursor-not-allowed disabled:bg-ink/35"
          disabled={!selectedOptionId}
          onClick={goNext}
          type="button"
        >
          {currentIndex === quiz.questions.length - 1 ? "Завершить" : "Далее"}
        </button>
      </div>
    </section>
  );
}
