import type { Metadata } from "next";
import { getCompletedCourseAccess, PackageAccessDenied } from "@/app/course/course-access-control";
import { logisticsBonusLessons } from "@/data/professions/logistics/bonus-lessons";
import { appendToken, getLogisticsAccessToken } from "../access";
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
    eyebrow: "Стартовый",
    title: "Пакет «Стартовый» завершён",
    text:
      "Вы прошли 1 блок и 10 уроков пакета «Стартовый» программы «Специалист по международной логистике».",
  },
  practice: {
    eyebrow: "Практический",
    title: "Пакет «Практический» завершён",
    text:
      "Вы прошли 2 блока и 20 уроков пакета «Практический» программы «Специалист по международной логистике».",
  },
  professional: {
    eyebrow: "Профессиональный",
    title: "Пакет «Профессиональный» завершён",
    text:
      "Вы прошли 3 блока и 30 уроков пакета «Профессиональный» программы «Специалист по международной логистике».",
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

export default async function LogisticsCompletedPage({ searchParams }: CompletedPageProps) {
  const { token: queryToken } = await searchParams;
  const token = await getLogisticsAccessToken(queryToken);
  const access = getCompletedCourseAccess("logistics", token);

  if (!access.ok) {
    return <PackageAccessDenied professionSlug="logistics" token={token} validation={access.validation} />;
  }

  const packageSlug = access.packageSlug;
  const content = getCompletionContent(packageSlug);
  const showBonusMaterials = packageSlug === "professional";

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
          <div className="mt-8">
            <a
              className="inline-flex rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href={appendToken("/course/logistics/basic", token)}
            >
              Вернуться к программе
            </a>
          </div>
        </div>
        {showBonusMaterials ? (
          <div className="mt-8 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              Дополнительные материалы
            </p>
            <h2 className="font-serif text-3xl leading-tight text-ink md:text-5xl">
              Бонусные уроки после завершения
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
              Эти материалы не входят в основные 30 уроков, но сохранены как
              дополнительная профессиональная траектория после завершения
              полного уровня.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {logisticsBonusLessons.map((lesson) => (
                <a
                  className="rounded-2xl border border-ink/10 bg-porcelain p-5 transition hover:border-gold/60 hover:bg-ivory"
                  href={appendToken(`/course/logistics/basic/bonus/${lesson.slug}`, token)}
                  key={lesson.slug}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    Бонусный материал
                  </p>
                  <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">
                    {lesson.title}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        ) : null}
        {packageSlug === "professional" ? (
          <section className="mt-8 rounded-3xl border border-gold/30 bg-gold/10 p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
              Электронный сертификат
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">
              Сертификат не выдаётся автоматически
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink/68">
              Эта страница подтверждает только переход к завершению материалов
              Профессионального пакета. Для выдачи электронного сертификата
              необходимо успешно пройти финальный экзамен и получить
              подтверждение проверки выпускного проекта.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/62">
              После подтверждения аттестации Академия сформирует персональный
              сертификат. Демонстрационный сертификат другого курса здесь не
              используется.
            </p>
          </section>
        ) : null}
      </section>
    </main>
  );
}
