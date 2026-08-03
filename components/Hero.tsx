import { EditorialImage } from "@/components/EditorialImage";
import { siteImages } from "@/data/images";

export function Hero() {
  return (
    <section className="overflow-hidden pb-16 pt-10 md:pb-[4.5rem] md:pt-12 lg:min-h-[calc(100svh-5rem)] lg:py-12 xl:py-14">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] xl:gap-14">
        <div className="min-w-0 max-w-[660px]">
          <div className="hero-reveal">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-gold sm:tracking-[0.28em]">
              Современная образовательная платформа
            </p>
            <h1 className="max-w-[640px] font-serif text-[clamp(2.35rem,4.6vw,3.35rem)] leading-[1.05] text-ink [overflow-wrap:anywhere]">
              Академия профессий
            </h1>
            <p className="mt-7 max-w-[620px] text-base leading-7 text-ink/72">
              <span className="block text-lg font-semibold leading-7 text-ink md:text-xl md:leading-8">
                Практическое образование для новой карьеры
              </span>
              <span className="mt-5 block">
                Получайте современные профессии полностью онлайн. Изучайте
                материалы в удобном темпе, выполняйте практические задания и
                получайте электронный сертификат после успешного завершения
                обучения.
              </span>
            </p>
          </div>
          <div className="hero-reveal hero-reveal-delay-1 mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-evergreen hover:shadow-[0_18px_42px_rgba(23,63,53,0.18)]"
              href="#catalog"
            >
              Выбрать программу
            </a>
            <a
              className="rounded-full border border-ink/10 bg-ivory/45 px-7 py-4 text-center text-sm font-semibold text-ink/78 transition duration-300 hover:-translate-y-0.5 hover:border-gold/70 hover:bg-ivory hover:text-evergreen hover:shadow-[0_16px_36px_rgba(38,49,45,0.08)]"
              href="#process"
            >
              Как проходит обучение
            </a>
          </div>
        </div>
        <div className="hero-reveal hero-reveal-delay-2 min-w-0">
          <EditorialImage
            alt="Современная образовательная платформа"
            className="rounded-[2.25rem] border-gold/20 shadow-[0_28px_90px_rgba(38,49,45,0.12)] md:min-h-[560px]"
            label="Онлайн-программы для получения новой профессии."
            priority
            src={siteImages.hero}
          />
        </div>
      </div>
    </section>
  );
}
