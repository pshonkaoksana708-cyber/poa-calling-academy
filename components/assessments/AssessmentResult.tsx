type QuestionReview = {
  correct: boolean;
  explanation?: string;
  id: string;
  text: string;
};

type AssessmentResultProps = {
  nextHref?: string;
  nextLabel?: string;
  onRestart: () => void;
  passed: boolean;
  percent: number;
  questionReviews: QuestionReview[];
  recommendedLabel: string;
  recommendedScore: number;
  requiresManualReview?: boolean;
  reviewHref: string;
  reviewLabel?: string;
  score: number;
  successTitle?: string;
  total: number;
};

export function AssessmentResult({
  nextHref,
  nextLabel,
  onRestart,
  passed,
  percent,
  questionReviews,
  recommendedLabel,
  recommendedScore,
  requiresManualReview,
  reviewHref,
  reviewLabel = "Повторить материал блока",
  score,
  successTitle = "Блок успешно освоен",
  total,
}: AssessmentResultProps) {
  return (
    <>
      <section className="mt-8 rounded-[1.75rem] border border-ink/10 bg-porcelain p-5 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
          Результат
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-ink">
          {passed ? successTitle : "Результат проверки знаний"}
        </h2>
        <div
          className={`mt-5 rounded-3xl border p-5 md:p-6 ${
            passed
              ? "border-evergreen/25 bg-evergreen/10"
              : "border-gold/35 bg-gold/10"
          }`}
        >
          <p
            className={`text-sm font-bold uppercase tracking-[0.2em] ${
              passed ? "text-evergreen" : "text-gold"
            }`}
          >
            {passed ? "Освоение подтверждено" : "Есть темы для повторения"}
          </p>
          <div className="mt-4 grid gap-2 text-lg leading-8 text-ink/78">
            <p>
              Результат: <span className="font-semibold text-ink">{percent}%</span>
            </p>
            <p>
              Правильных ответов:{" "}
              <span className="font-semibold text-ink">
                {score} из {total}
              </span>
            </p>
            <p>
              {recommendedLabel}:{" "}
              <span className="font-semibold text-ink">{recommendedScore}%</span>
            </p>
          </div>
          <p className="mt-4 text-base leading-7 text-ink/72">
            {passed
              ? "Поздравляем: результат показывает уверенное освоение материала. Вы можете перейти к следующему этапу обучения."
              : "Есть темы для повторения. Вы можете вернуться к материалу и закрепить знания."}
          </p>
        </div>
        {requiresManualReview ? (
          <p className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm leading-6 text-ink/72">
            В тесте есть открытые вопросы или кейсы. Они требуют ручной проверки
            и не входят в автоматический процент.
          </p>
        ) : null}
        <div className="mt-7 grid gap-3">
          {questionReviews.map((question, index) => (
            <div
              className="rounded-2xl border border-ink/10 bg-ivory p-4"
              key={question.id}
            >
              <p className="font-semibold text-ink">
                {index + 1}. {question.text}
              </p>
              <p className="mt-2 text-sm text-ink/68">
                {question.correct
                  ? "Ответ верный"
                  : "Ответ требует повторения материала"}
              </p>
              {question.explanation ? (
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  {question.explanation}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        {passed ? (
          <>
            <button
              className="rounded-full border border-ink/15 bg-ivory px-7 py-4 text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
              onClick={onRestart}
              type="button"
            >
              Начать заново
            </button>
            {nextHref ? (
              <a
                className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                href={nextHref}
              >
                {nextLabel ?? "Продолжить"}
              </a>
            ) : null}
          </>
        ) : (
          <>
            <a
              className="rounded-full border border-gold/35 bg-gold/10 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
              href={reviewHref}
            >
              {reviewLabel}
            </a>
            {nextHref ? (
              <a
                className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                href={nextHref}
              >
                {nextLabel ?? "Перейти к следующему блоку"}
              </a>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
