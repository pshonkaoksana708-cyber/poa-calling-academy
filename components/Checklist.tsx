type ChecklistProps = {
  items: string[];
};

export function Checklist({ items }: ChecklistProps) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          className="flex gap-3 rounded-2xl border border-ink/10 bg-ivory p-4 text-sm leading-6 text-ink/72"
          key={item}
        >
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
