type ModuleCardProps = {
  index: number;
  title: string;
  description: string;
  lessonCount?: number;
};

export function ModuleCard({
  index,
  title,
  description,
  lessonCount,
}: ModuleCardProps) {
  return (
    <article className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
      <p className="text-sm font-bold text-gold">
        Модуль {String(index).padStart(2, "0")}
      </p>
      <h3 className="mt-4 font-serif text-3xl leading-tight text-ink">{title}</h3>
      <p className="mt-4 leading-8 text-ink/68">{description}</p>
      {typeof lessonCount === "number" ? (
        <p className="mt-6 rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/62">
          {lessonCount} урок(а)
        </p>
      ) : null}
    </article>
  );
}
