type CareerPathStep = {
  label?: string;
  title: string;
  description: string;
};

type CareerPathProps = {
  steps: CareerPathStep[];
};

export function CareerPath({ steps }: CareerPathProps) {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <article className="relative rounded-3xl bg-porcelain p-6" key={step.title}>
            <p className="text-sm font-bold text-gold">
              {step.label ??
                (index === 0
                  ? "Старт"
                  : index === steps.length - 1
                    ? "Результат"
                    : "Этап")}
            </p>
            <h3 className="mt-5 font-serif text-3xl leading-tight text-ink [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal]">
              {step.title}
            </h3>
            <p className="mt-4 leading-7 text-ink/68">{step.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
