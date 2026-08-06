type AuthorCardProps = {
  name?: string;
  title?: string;
  description: string;
  imageSrc?: string;
};

export function AuthorCard({
  title = "Практические программы от эксперта с реальным профессиональным опытом",
  description,
  imageSrc = "/images/author/author-10.webp",
}: AuthorCardProps) {
  return (
    <article className="grid gap-8 rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-8 lg:grid-cols-[320px_1fr] lg:items-center">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-mist bg-ivory">
        <img
          src={imageSrc}
          alt="Автор"
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
          Об авторе
        </p>
        <h3 className="mt-5 font-serif text-4xl leading-tight text-ink">
          {title}
        </h3>
        <p className="mt-5 leading-8 text-ink/70">{description}</p>
      </div>
    </article>
  );
}
