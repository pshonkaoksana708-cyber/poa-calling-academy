type TimelineStep = {
  title: string;
  description: string;
};

type TimelineProps = {
  steps: TimelineStep[];
};

export function Timeline({ steps }: TimelineProps) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <li
          className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft"
          key={`${step.title}-${index}`}
        >
          <p className="text-sm font-bold text-gold">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-5 font-serif text-3xl leading-tight text-ink">
            {step.title}
          </h3>
          <p className="mt-4 leading-7 text-ink/68">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
