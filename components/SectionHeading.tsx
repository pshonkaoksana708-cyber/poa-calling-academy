type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
        {eyebrow}
      </p>
      <h2 className="font-serif text-4xl leading-tight text-ink md:text-6xl">{title}</h2>
      {description ? (
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink/68">
          {description}
        </p>
      ) : null}
    </div>
  );
}
