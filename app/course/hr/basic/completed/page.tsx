import { CertificateSection } from "@/components/CertificateSection";

export const dynamic = "force-dynamic";

type CompletedPageProps = {
  searchParams: Promise<{
    package?: string;
    token?: string;
  }>;
};

const completionContent = {
  basic: {
    eyebrow: "Базовый пакет",
    title: "Базовый пакет завершён",
    text:
      "Вы прошли 1 блок и 10 уроков базового пакета программы «Специалист по кадрам и управлению персоналом».",
  },
  practice: {
    eyebrow: "Практический пакет",
    title: "Практический пакет завершён",
    text:
      "Вы прошли 2 блока и 20 уроков практического пакета программы «Специалист по кадрам и управлению персоналом».",
  },
  professional: {
    eyebrow: "Профессиональный уровень",
    title: "Программа завершена",
    text:
      "Вы завершили 3 блока и 30 уроков программы «Специалист по кадрам и управлению персоналом». Вам доступны 3 блока тестирования, итоговый профессиональный проект, финальный экзамен и электронный сертификат.",
  },
};

const professionalSummary = [
  "Завершены 3 блока образовательной программы.",
  "Пройдены 30 уроков по подбору, адаптации, развитию и HR-стратегии.",
  "Доступны 3 блока тестирования для проверки знаний.",
  "Выполнен итоговый профессиональный проект.",
  "Доступен финальный экзамен по всей программе.",
  "После завершения программы выпускник получает электронный сертификат.",
];

function getCompletionContent(packageSlug?: string) {
  if (
    packageSlug === "basic" ||
    packageSlug === "practice" ||
    packageSlug === "professional"
  ) {
    return completionContent[packageSlug];
  }

  return completionContent.professional;
}

export default async function HrCompletedPage({ searchParams }: CompletedPageProps) {
  const { package: packageSlug } = await searchParams;
  const content = getCompletionContent(packageSlug);

  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <div className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            {content.eyebrow}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            {content.text}
          </p>
          {packageSlug === "professional" || !packageSlug ? (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {professionalSummary.map((item) => (
                <div
                  className="rounded-2xl border border-ink/10 bg-porcelain p-4 text-sm font-semibold leading-6 text-ink/76"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-8">
            <a
              className="inline-flex rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href="/course/hr/basic"
            >
              Вернуться к программе
            </a>
          </div>
        </div>
        <CertificateSection />
      </section>
    </main>
  );
}
