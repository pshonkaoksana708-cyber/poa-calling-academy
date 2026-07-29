import type { ReactNode } from "react";

type LessonCardProps = {
  index: number;
  title: string;
  duration?: string;
  children?: ReactNode;
};

export function LessonCard({
  index,
  title,
  duration,
  children,
}: LessonCardProps) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-porcelain p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <h3 className="font-serif text-2xl leading-tight text-ink">
          {index}. {title}
        </h3>
        {duration ? (
          <span className="text-sm font-semibold text-evergreen">{duration}</span>
        ) : null}
      </div>
      {children ? <div className="mt-5 leading-8 text-ink/72">{children}</div> : null}
    </section>
  );
}
