import { faqItems } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";

export function FAQ() {
  return (
    <section className="section-space bg-ivory/50" id="faq">
      <div className="container-shell">
        <SectionHeading eyebrow="ВОПРОСЫ" title="Частые вопросы" />
        <div className="mx-auto max-w-4xl divide-y divide-ink/10">
          {faqItems.map((item) => (
            <details className="group py-7" key={item.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-semibold text-ink">
                {item.question}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 text-gold transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-5 max-w-3xl leading-8 text-ink/68">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
