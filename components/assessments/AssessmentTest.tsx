"use client";

import { useEffect, useMemo, useState } from "react";
import { AssessmentResult } from "@/components/assessments/AssessmentResult";
import type { Assessment, AssessmentQuestion } from "@/data/assessments/types";

type AssessmentTestProps = {
  assessment: Assessment;
  backHref: string;
  nextHref?: string;
  nextLabel?: string;
  reviewHref?: string;
};

type StoredResult = {
  answers: Record<string, string | string[]>;
  completed: boolean;
  percent: number;
  score: number;
  total: number;
};

function storageKey(assessment: Assessment) {
  return `apr-assessment:${assessment.professionSlug}:${assessment.id}`;
}

function isCorrect(question: AssessmentQuestion, answer?: string | string[]) {
  if (question.requiresManualReview) {
    return false;
  }

  if (question.type === "multiple-choice") {
    const expected = [...(question.correctAnswers ?? [])].sort();
    const actual = Array.isArray(answer) ? [...answer].sort() : [];

    return expected.length > 0 && expected.join("|") === actual.join("|");
  }

  return Boolean(question.correctAnswer && answer === question.correctAnswer);
}

function hasAnswer(answer?: string | string[]) {
  return Array.isArray(answer) ? answer.length > 0 : Boolean(answer?.trim());
}

export function AssessmentTest({
  assessment,
  backHref,
  nextHref,
  nextLabel,
  reviewHref,
}: AssessmentTestProps) {
  const questions = assessment.questions ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<StoredResult | null>(null);

  const key = useMemo(() => storageKey(assessment), [assessment]);
  const currentQuestion = questions[activeIndex];
  const answeredCount = questions.filter((question) =>
    hasAnswer(answers[question.id]),
  ).length;
  const progress = questions.length
    ? ((activeIndex + 1) / questions.length) * 100
    : 0;

  useEffect(() => {
    const saved = window.localStorage.getItem(key);

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as StoredResult;
      setAnswers(parsed.answers ?? {});
      setCompleted(parsed.completed ?? false);
      setResult(parsed);
    } catch {
      window.localStorage.removeItem(key);
    }
  }, [key]);

  useEffect(() => {
    if (!questions.length) {
      return;
    }

    const payload: StoredResult = {
      answers,
      completed,
      percent: result?.percent ?? 0,
      score: result?.score ?? 0,
      total: result?.total ?? 0,
    };

    window.localStorage.setItem(key, JSON.stringify(payload));
  }, [answers, completed, key, questions.length, result]);

  function setSingleAnswer(questionId: string, optionId: string) {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  }

  function toggleMultipleAnswer(questionId: string, optionId: string) {
    setAnswers((current) => {
      const existing = Array.isArray(current[questionId])
        ? (current[questionId] as string[])
        : [];

      return {
        ...current,
        [questionId]: existing.includes(optionId)
          ? existing.filter((item) => item !== optionId)
          : [...existing, optionId],
      };
    });
  }

  function setOpenAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function finishTest() {
    const unanswered = questions.filter((question) => !hasAnswer(answers[question.id]));

    if (unanswered.length) {
      const ok = window.confirm(
        `Без ответа осталось: ${unanswered.length}. Завершить тест сейчас?`,
      );

      if (!ok) {
        return;
      }
    }

    const autoQuestions = questions.filter(
      (question) => !question.requiresManualReview,
    );
    const score = autoQuestions.filter((question) =>
      isCorrect(question, answers[question.id]),
    ).length;
    const total = autoQuestions.length;
    const percent = total ? Math.round((score / total) * 100) : 0;
    const nextResult = { answers, completed: true, percent, score, total };

    setResult(nextResult);
    setCompleted(true);
    window.localStorage.setItem(key, JSON.stringify(nextResult));
  }

  function restart() {
    if (!window.confirm("Начать прохождение заново? Текущие ответы будут удалены.")) {
      return;
    }

    setAnswers({});
    setCompleted(false);
    setResult(null);
    setActiveIndex(0);
    window.localStorage.removeItem(key);
  }

  if (!questions.length) {
    return null;
  }

  const passed =
    completed && result
      ? result.percent >= (assessment.passingScore ?? 70)
      : false;
  const recommendedScore = assessment.passingScore ?? 70;
  const recommendedLabel =
    assessment.type === "final-exam"
      ? "Рекомендуемый уровень освоения программы"
      : "Рекомендуемый уровень освоения блока";
  const reviewLabel =
    assessment.type === "final-exam"
      ? "Повторить материалы программы"
      : "Повторить материал блока";
  const successTitle =
    assessment.type === "final-exam"
      ? "Программа успешно освоена"
      : "Блок успешно освоен";
  const reviewMaterialHref = reviewHref ?? backHref;
  const questionReviews = questions
    .filter((question) => !question.requiresManualReview)
    .map((question) => ({
      correct: isCorrect(question, answers[question.id]),
      explanation: question.explanation,
      id: question.id,
      text: question.text,
    }));

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
                Аттестация
              </p>
              <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
                {assessment.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-ink/72 md:text-lg">
                {assessment.description}
              </p>
            </header>

            <div className="p-6 md:p-10">
            {assessment.instructions.length ? (
              <div className="rounded-3xl border border-gold/25 bg-gold/10 p-5 md:p-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  Инструкция
                </p>
                <ul className="grid gap-2 text-sm leading-6 text-ink/74">
                  {assessment.instructions.slice(0, 8).map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {!completed && currentQuestion ? (
              <section className="mt-8 rounded-[1.75rem] border border-ink/10 bg-porcelain p-5 md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <p className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold">
                    Вопрос {activeIndex + 1} из {questions.length}
                  </p>
                  <p className="text-sm text-ink/60">
                    Отвечено: {answeredCount} / {questions.length}
                  </p>
                </div>
                <div className="mb-7 h-2 overflow-hidden rounded-full bg-mist">
                  <div
                    className="h-full rounded-full bg-terracotta transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
                  {currentQuestion.text}
                </h2>

                {currentQuestion.options?.length ? (
                  <div className="mt-7 grid gap-3">
                    {currentQuestion.options.map((option) => {
                      const answer = answers[currentQuestion.id];
                      const selected = Array.isArray(answer)
                        ? answer.includes(option.id)
                        : answer === option.id;

                      return (
                        <button
                          className={`w-full rounded-2xl border p-4 text-left text-base leading-7 shadow-sm transition md:p-5 ${
                            selected
                              ? "border-gold bg-gold/15 text-ink ring-2 ring-gold/20"
                              : "border-ink/10 bg-ivory text-ink/74 hover:border-gold/50 hover:bg-white"
                          }`}
                          key={option.id}
                          onClick={() =>
                            currentQuestion.type === "multiple-choice"
                              ? toggleMultipleAnswer(currentQuestion.id, option.id)
                              : setSingleAnswer(currentQuestion.id, option.id)
                          }
                          type="button"
                        >
                          {option.text}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    className="mt-7 min-h-40 w-full rounded-2xl border border-ink/10 bg-ivory p-4 text-base leading-7 text-ink outline-none transition placeholder:text-ink/40 focus:border-gold focus:ring-4 focus:ring-gold/15"
                    onChange={(event) =>
                      setOpenAnswer(currentQuestion.id, event.target.value)
                    }
                    placeholder="Введите ответ. Он потребует ручной проверки."
                    value={(answers[currentQuestion.id] as string) ?? ""}
                  />
                )}

                {currentQuestion.requiresManualReview ? (
                  <p className="mt-5 rounded-2xl border border-ink/10 bg-ivory p-4 text-sm leading-6 text-ink/68">
                    Этот вопрос требует ручной проверки. Он сохранится в
                    локальном прогрессе, но не будет засчитан автоматически.
                  </p>
                ) : null}
              </section>
            ) : null}

            {completed && result ? (
              <AssessmentResult
                nextHref={nextHref}
                nextLabel={nextLabel}
                onRestart={restart}
                passed={passed}
                percent={result.percent}
                questionReviews={questionReviews}
                recommendedLabel={recommendedLabel}
                recommendedScore={recommendedScore}
                requiresManualReview={assessment.requiresManualReview}
                reviewHref={reviewMaterialHref}
                reviewLabel={reviewLabel}
                score={result.score}
                successTitle={successTitle}
                total={result.total}
              />
            ) : null}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <a
                className="rounded-full border border-ink/15 bg-ivory px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
                href={backHref}
              >
                Вернуться к программе
              </a>
              {!completed ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="rounded-full border border-ink/15 bg-ivory px-7 py-4 text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={activeIndex === 0}
                    onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
                    type="button"
                  >
                    Назад
                  </button>
                  {activeIndex < questions.length - 1 ? (
                    <button
                      className="rounded-full bg-ink px-7 py-4 text-sm font-semibold text-white transition hover:bg-evergreen"
                      onClick={() =>
                        setActiveIndex((index) =>
                          Math.min(questions.length - 1, index + 1),
                        )
                      }
                      type="button"
                    >
                      Следующий вопрос
                    </button>
                  ) : (
                    <button
                      className="rounded-full bg-ink px-7 py-4 text-sm font-semibold text-white transition hover:bg-evergreen"
                      onClick={finishTest}
                      type="button"
                    >
                      Завершить тест
                    </button>
                  )}
                </div>
              ) : null}
            </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft lg:sticky lg:top-8">
            <p className="text-sm font-semibold text-gold">Локальный прогресс</p>
            <p className="mt-3 font-serif text-3xl leading-tight text-ink">
              {answeredCount} / {questions.length}
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-terracotta transition-all duration-300"
                style={{ width: `${Math.round((answeredCount / questions.length) * 100)}%` }}
              />
            </div>
            <p className="mt-5 text-sm leading-6 text-ink/68">
              Прогресс сохраняется только на этом устройстве. Официальный
              сертификат формируется после подтверждения прохождения программы.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
