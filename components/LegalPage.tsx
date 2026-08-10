type LegalSection = {
  title: string;
  text: string;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
};

export function LegalPage({ eyebrow, title, description, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <div className="container-shell">
        <a className="text-sm font-semibold text-ink/70 transition hover:text-ink" href="/">
          Вернуться на главную
        </a>

        <section className="mt-10 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/68 md:text-lg">
            {description}
          </p>

          <div className="mt-12 divide-y divide-ink/10">
            {sections.map((section) => (
              <article className="py-7" key={section.title}>
                <h2 className="font-serif text-2xl text-ink md:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-4 max-w-4xl space-y-4 text-base leading-8 text-ink/70">
                  {section.text.split("\n\n").map((paragraph) => (
                    <p className="whitespace-pre-line" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
