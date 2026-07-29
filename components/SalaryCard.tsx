type SalaryCardProps = {
  title: string;
  value: string;
  description?: string;
};

export function SalaryCard({ title, value, description }: SalaryCardProps) {
  return (
    <article className="rounded-3xl border border-ink/10 bg-ivory p-7 shadow-soft">
      <p className="text-sm font-semibold text-gold">{title}</p>
      <p className="mt-4 font-serif text-4xl leading-tight text-ink [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal]">
        {value}
      </p>
      {description ? (
        <p className="mt-4 leading-7 text-ink/68">{description}</p>
      ) : null}
    </article>
  );
}
