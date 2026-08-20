import Image from "next/image";

const certificateBenefits = [
  "Подтверждение профессиональных навыков",
  "Уникальный номер сертификата",
  "Проверка подлинности через QR-код",
  "Возможность использовать сертификат в профессиональном портфолио",
];

export function CertificateSection() {
  return (
    <section className="section-space bg-porcelain" id="certificate">
      <div className="container-shell">
        <div className="grid items-center gap-10 rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:p-12">
          <div className="min-w-0">
            <div className="relative mx-auto aspect-[1.45/1] w-full max-w-[52rem] overflow-hidden rounded-[1.75rem] border border-gold/35 bg-porcelain shadow-soft">
              <Image
                alt="Макет сертификата POA CALLING — Академии профессионального развития"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                src="/images/certificates/certificate-template.png"
              />
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-ink/68">
              Каждый выпускник получает персональный сертификат с уникальным
              номером и возможностью проверки подлинности.
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-gold">
              Сертификат
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-ink [overflow-wrap:anywhere] md:text-5xl">
              Завершите обучение и получите профессиональный сертификат
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-ink/70 md:text-lg">
              После завершения программы, выполнения практических заданий и
              итогового проекта выпускник получает сертификат Академии
              профессионального развития.
            </p>

            <ul className="mt-8 grid gap-4">
              {certificateBenefits.map((item) => (
                <li
                  className="flex gap-3 rounded-2xl border border-ink/10 bg-porcelain p-4 text-sm font-semibold leading-6 text-ink/78"
                  key={item}
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-sm text-evergreen">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
                href="/certificate/DEMO-2026-000001"
              >
                Посмотреть сертификат
              </a>
              <a
                className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
                href="/verify"
              >
                Проверить сертификат
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
