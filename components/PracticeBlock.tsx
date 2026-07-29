import type { ReactNode } from "react";

type PracticeBlockProps = {
  title?: string;
  children: ReactNode;
};

export function PracticeBlock({
  title = "Практическое задание",
  children,
}: PracticeBlockProps) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-ivory p-5">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
        {title}
      </p>
      <div className="mt-3 leading-7 text-ink/74">{children}</div>
    </div>
  );
}
