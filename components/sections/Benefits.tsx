import { benefits } from "@/data/site";
import { siteImages } from "@/data/images";
import { EditorialImage } from "@/components/EditorialImage";
import { SectionHeading } from "@/components/SectionHeading";

export function Benefits() {
  return (
    <section className="section-space border-y hairline bg-ivory/45" id="approach">
      <div className="container-shell">
        <SectionHeading
          eyebrow="ПОДХОД"
          title="Практический подход"
          description="В основе программ — реальные рабочие задачи, документы, чек-листы, практические задания и понятные алгоритмы."
        />
        <div className="mb-12 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <EditorialImage
            alt="Практические материалы Академии"
            aspect="wide"
            icon="spark"
            label="Визуал практических материалов, документов и чек-листов"
            src={siteImages.approach}
          />
          <div className="rounded-3xl border border-ink/10 bg-porcelain p-8 shadow-soft">
            <p className="font-serif text-3xl leading-tight text-ink md:text-4xl">
              Программа должна помогать человеку понимать, что делать в
              реальной рабочей ситуации.
            </p>
            <p className="mt-6 text-lg leading-8 text-ink/70">
              Поэтому каждый блок строится вокруг прикладных задач, понятной
              последовательности действий и материалов, к которым можно
              возвращаться во время работы.
            </p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit, index) => (
            <article
              className="rounded-3xl border border-ink/10 bg-porcelain p-8 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
              key={benefit.title}
            >
              <span className="text-sm font-bold text-gold">0{index + 1}</span>
              <h3 className="mt-8 font-serif text-3xl text-ink">{benefit.title}</h3>
              <p className="mt-5 leading-7 text-ink/68">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
