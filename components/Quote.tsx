type QuoteProps = {
  text: string;
  author?: string;
  role?: string;
};

export function Quote({ text, author, role }: QuoteProps) {
  return (
    <figure className="rounded-[2rem] border border-ink/10 bg-ivory p-7 shadow-soft md:p-10">
      <blockquote className="font-serif text-3xl leading-tight text-ink md:text-4xl">
        “{text}”
      </blockquote>
      {(author || role) ? (
        <figcaption className="mt-6 text-sm leading-6 text-ink/62">
          {author ? <span className="font-semibold text-ink">{author}</span> : null}
          {role ? <span className="block">{role}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
