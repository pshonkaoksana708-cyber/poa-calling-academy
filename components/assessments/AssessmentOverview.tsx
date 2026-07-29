import type { Assessment } from "@/data/assessments/types";

type AssessmentOverviewProps = {
  assessments: Assessment[];
  professionTitle: string;
  slug: string;
  token?: string;
};

function getAssessment(
  assessments: Assessment[],
  predicate: (assessment: Assessment) => boolean,
) {
  return assessments.find(predicate);
}

function StatusCard({
  href,
  status,
  title,
}: {
  href: string;
  status: "ready" | "missing";
  title: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-ink/10 bg-ivory p-5 shadow-soft md:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
        {status === "ready" ? "Подключено" : "Ожидает материала"}
      </p>
      <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">
        {title}
      </h2>
      <a
        className={`mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold transition ${
          status === "ready"
            ? "bg-ink text-white hover:bg-evergreen"
            : "border border-ink/15 text-ink hover:border-gold hover:text-evergreen"
        }`}
        href={href}
      >
        {status === "ready" ? "Открыть" : "Посмотреть статус"}
      </a>
    </article>
  );
}

export function AssessmentOverview({
  assessments,
  professionTitle,
  slug,
  token,
}: AssessmentOverviewProps) {
  const appendToken = (href: string) =>
    token ? `${href}?token=${encodeURIComponent(token)}` : href;
  const blockTestHref = (blockNumber: number) =>
    `/course/${slug}/basic/block-${blockNumber}-test`;
  const cards = [
    {
      href: appendToken(blockTestHref(1)),
      item: getAssessment(
        assessments,
        (assessment) =>
          assessment.type === "block-test" && assessment.blockNumber === 1,
      ),
      title: "Тест после Блока 1",
    },
    {
      href: appendToken(blockTestHref(2)),
      item: getAssessment(
        assessments,
        (assessment) =>
          assessment.type === "block-test" && assessment.blockNumber === 2,
      ),
      title: "Тест после Блока 2",
    },
    {
      href: appendToken(blockTestHref(3)),
      item: getAssessment(
        assessments,
        (assessment) =>
          assessment.type === "block-test" && assessment.blockNumber === 3,
      ),
      title: "Тест после Блока 3",
    },
    {
      href: appendToken(`/course/${slug}/basic/final-project`),
      item: getAssessment(
        assessments,
        (assessment) => assessment.type === "final-project",
      ),
      title: "Итоговый проект",
    },
    {
      href: appendToken(`/course/${slug}/basic/final-exam`),
      item: getAssessment(
        assessments,
        (assessment) => assessment.type === "final-exam",
      ),
      title: "Финальный экзамен",
    },
  ];

  return (
    <main className="min-h-screen bg-porcelain py-12 md:py-18">
      <section className="container-shell">
        <div className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Аттестация
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
            {professionTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-ink/72 md:text-lg">
            Здесь собраны тесты после блоков, итоговый проект и финальный
            экзамен. Прогресс сохраняется локально на текущем устройстве и не
            заменяет официальное подтверждение выдачи сертификата.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <StatusCard
              href={card.href}
              key={card.href}
              status={card.item ? "ready" : "missing"}
              title={card.item?.title ?? card.title}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
