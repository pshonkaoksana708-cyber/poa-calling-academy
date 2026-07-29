import { EditorialImage } from "@/components/EditorialImage";
import { siteImages } from "@/data/images";

export function Hero() {
  return (
    <section className="overflow-hidden pb-16 pt-10 md:pb-[4.5rem] md:pt-12 lg:min-h-[calc(100svh-5rem)] lg:py-12 xl:py-14">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] xl:gap-14">
        <div className="min-w-0 max-w-[660px] animate-reveal">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold sm:tracking-[0.28em]">
            Практическое образование
          </p>
          <h1 className="max-w-[640px] font-serif text-[clamp(2.35rem,4.6vw,3.35rem)] leading-[1.05] text-ink [overflow-wrap:anywhere]">
            POA CALLING
          </h1>
          <p className="mt-4 max-w-[620px] text-base leading-7 text-ink/72">
            <span className="block text-lg font-semibold leading-7 text-ink md:text-xl md:leading-8">
              Академия профессионального развития.
            </span>
            <span className="mt-3 block">
              Выбирайте образовательную программу, проходите обучение в удобном
              темпе и получайте электронный сертификат после завершения.
            </span>
          </p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href="#catalog"
            >
              Выбрать программу
            </a>
            <a
              className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
              href="#process"
            >
              Как проходит обучение
            </a>
          </div>
        </div>
        <div className="min-w-0 animate-float">
          <EditorialImage
            alt="Автор образовательных программ Академии"
            className="md:min-h-[560px]"
            label="Практические программы от автора с реальным профессиональным опытом."
            priority
            src={siteImages.hero}
          />
        </div>
      </div>
    </section>
  );
}
