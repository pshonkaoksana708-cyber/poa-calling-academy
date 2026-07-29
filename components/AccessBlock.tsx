type AccessBlockProps = {
  title?: string;
  description?: string;
  steps: string[];
};

export function AccessBlock({
  title = "Как вы получите доступ",
  description = "Материалы образовательной программы открываются после оплаты по защищенной ссылке, которая приходит на указанный email.",
  steps,
}: AccessBlockProps) {
  return (
    <div className="grid gap-10 rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
          Access model
        </p>
        <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-8 text-ink/68">
          {description}
        </p>
      </div>
      <ol className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <li className="rounded-3xl border border-ink/10 bg-porcelain p-5" key={step}>
            <span className="text-sm font-bold text-gold">0{index + 1}</span>
            <p className="mt-4 text-base leading-7 text-ink/76">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
