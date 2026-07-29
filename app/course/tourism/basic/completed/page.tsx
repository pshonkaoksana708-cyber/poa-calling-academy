import { CertificateAccess } from "@/components/CertificateAccess";

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
      "Вы прошли 1 блок и 10 уроков базового пакета программы «Специалист по туризму».",
  },
  practice: {
    eyebrow: "Практический пакет",
    title: "Практический пакет завершён",
    text:
      "Вы прошли 2 блока и 20 уроков практического пакета программы «Специалист по туризму».",
  },
  professional: {
    eyebrow: "Профессиональный уровень",
    title: "Профессиональный уровень завершён",
    text:
      "Вы прошли 3 блока и 30 уроков профессионального уровня программы «Специалист по туризму».",
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

export default async function TourismCompletedPage({ searchParams }: CompletedPageProps) {
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
          <div className="mt-8">
            <a
              className="inline-flex rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href="/course/tourism/basic"
            >
              Вернуться к программе
            </a>
          </div>
        </div>
        <CertificateAccess certificateId="DEMO-2026-000001" courseTitle="Специалист по туризму" />
      </section>
    </main>
  );
}
