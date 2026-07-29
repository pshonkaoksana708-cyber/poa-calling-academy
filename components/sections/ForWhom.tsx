import { audiences } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";

export function ForWhom() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <SectionHeading
          eyebrow="АУДИТОРИЯ"
          title="Для кого образовательные программы"
          description="Академия создана для людей с разным опытом: от выпускников и студентов до специалистов, которые хотят сменить направление, вернуться к работе или повысить квалификацию."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {audiences.map((item, index) => (
            <article
              className="min-w-0 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/50"
              key={item}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                0{index + 1}
              </span>
              <p className="mt-8 text-lg leading-8 text-ink">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
