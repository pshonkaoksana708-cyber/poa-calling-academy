type PlaceholderMediaProps = {
  label: string;
  className?: string;
};

export function PlaceholderMedia({ label, className = "" }: PlaceholderMediaProps) {
  return (
    <div
      className={`image-placeholder flex aspect-[4/5] min-h-[340px] items-end overflow-hidden rounded-[2rem] border border-ink/10 p-6 shadow-soft md:min-h-[420px] md:p-8 ${className}`}
    >
      <div className="max-w-xs rounded-2xl border border-white/55 bg-ivory/82 p-5 text-sm leading-6 text-ink/70 backdrop-blur">
        {label}
      </div>
    </div>
  );
}
