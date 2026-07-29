type AssessmentUnavailableProps = {
  backHref: string;
  title: string;
};

export function AssessmentUnavailable({
  backHref,
  title,
}: AssessmentUnavailableProps) {
  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <div className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Аттестация
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            Материал для этого этапа аттестации пока не подключен. Мы не
            показываем пустой тест и не создаем вымышленные вопросы без
            исходного документа.
          </p>
          <a
            className="mt-8 inline-flex rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
            href={backHref}
          >
            Вернуться к программе
          </a>
        </div>
      </section>
    </main>
  );
}
