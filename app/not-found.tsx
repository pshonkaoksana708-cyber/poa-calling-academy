export default function NotFound() {
  return (
    <main className="min-h-screen bg-porcelain px-5 py-16 text-ink md:py-24">
      <section className="container-shell">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-ivory p-8 text-center shadow-soft md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-gold">
            404
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-ink md:text-6xl">
            Страница не найдена
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink/70 md:text-lg">
            Возможно, ссылка устарела или адрес был введён неправильно.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href="/"
            >
              Вернуться на главную
            </a>
            <a
              className="rounded-full border border-gold/60 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:bg-gold hover:text-ink"
              href="/#catalog"
            >
              Выбрать программу
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
