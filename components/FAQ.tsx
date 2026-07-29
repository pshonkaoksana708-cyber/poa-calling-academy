type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
};

export function FAQ({ items }: FAQProps) {
  return (
    <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-ivory shadow-soft">
      {items.map((item) => (
        <details className="group p-6 md:p-7" key={item.question}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-2xl leading-tight text-ink">
            {item.question}
            <span className="text-gold transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 max-w-3xl leading-8 text-ink/68">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
