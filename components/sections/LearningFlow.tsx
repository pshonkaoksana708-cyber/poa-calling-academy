import { learningSteps } from "@/data/site";
import { siteImages } from "@/data/images";
import { EditorialImage } from "@/components/EditorialImage";
import { SectionHeading } from "@/components/SectionHeading";

export function LearningFlow() {
  return (
    <section className="section-space" id="process">
      <div className="container-shell">
        <SectionHeading
          eyebrow="ПРОЦЕСС"
          title="Как проходит обучение"
          description="Путь остается простым и прозрачным: выбор программы, форма, оплата, письмо с доступом, изучение материалов и электронный сертификат после завершения."
        />
        <div className="grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <EditorialImage
            alt="Процесс обучения в Академии"
            aspect="wide"
            icon="spark"
            label="Визуал процесса обучения"
            src={siteImages.learning}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {learningSteps.map((step, index) => (
              <article
                className="min-w-0 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft"
                key={step}
              >
                <span className="font-serif text-5xl text-gold">{index + 1}</span>
                <p className="mt-6 leading-7 text-ink/72">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
