type ResultCardProps = {
  title: string;
  items: string[];
};

export function ResultCard({ title, items }: ResultCardProps) {
  return (
    <article className="rounded-3xl border border-ink/10 bg-ivory p-7 shadow-soft">
      <h3 className="font-serif text-3xl leading-tight text-ink">{title}</h3>
      <ul className="mt-6 grid gap-3 leading-7 text-ink/70">
        {items.map((item) => (
          <li className="border-t border-ink/10 pt-3" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
