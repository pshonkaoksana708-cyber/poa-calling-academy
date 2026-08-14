import type { Metadata } from "next";
import { CertificateSection } from "@/components/CertificateSection";
import { noIndexRobots } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

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
      "Вы прошли 1 блок и 10 уроков базового пакета программы «Специалист по снабжению».",
  },
  practice: {
    eyebrow: "Практический пакет",
    title: "Практический пакет завершён",
    text:
      "Вы прошли 2 блока и 20 уроков практического пакета программы «Специалист по снабжению».",
  },
  professional: {
    eyebrow: "Профессиональный уровень",
    title: "Профессиональный уровень завершён",
    text:
      "Вы прошли 3 блока и 30 уроков профессионального уровня программы «Специалист по снабжению».",
  },
};

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

export default async function SupplyBasicCompletedPage({
  searchParams,
}: CompletedPageProps) {
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
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Блок 1. Основы профессии специалиста по снабжению",
              "Тест после Блока 1",
              "Блок 2. Управление закупками и поставщиками",
              "Тест после Блока 2",
              "Блок 3. Контроль, аналитика и эффективность",
              "Тест после Блока 3",
              "Итоговый проект",
              "Финальный экзамен",
            ].map((item) => (
              <div
                className="rounded-2xl border border-ink/10 bg-porcelain p-4 text-sm font-semibold leading-6 text-ink/74"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/10 p-5 text-sm leading-7 text-ink/72">
            <p className="font-semibold text-ink">Условия завершения программы</p>
            <p className="mt-2">
              Для завершения полной программы необходимо пройти три блока,
              выполнить три блоковых теста, подготовить итоговый проект и
              успешно пройти финальный экзамен. Итоговый проект требует ручной
              проверки, поэтому официальный сертификат не выдается только на
              основании данных localStorage.
            </p>
          </div>
          <div className="mt-8">
            <a
              className="inline-flex rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href="/course/supply/basic"
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
