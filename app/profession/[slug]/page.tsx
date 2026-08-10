import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AccessBlock,
  CareerPath,
  FAQ,
  ProfessionCard,
  ProgramCard,
  ResultCard,
  SalaryCard,
  SkillsGrid,
} from "@/components";
import { CertificateSection } from "@/components/CertificateSection";
import { accessDeliverySteps } from "@/data/config/email";
import { getProfessionImage, getProfessionLevelImage } from "@/data/images";
import { getProfession } from "@/data/professions";

type ProfessionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const professionFaqItems = [
  {
    question: "Можно ли начать с базового уровня без опыта в снабжении?",
    answer:
      "Да. Базовый уровень рассчитан на спокойный вход в профессию: вы разберете роль снабжения, закупочный цикл, заявки, поставщиков и первые практические задачи.",
  },
  {
    question: "Чем отличаются пакеты профессии?",
    answer:
      "Basic открывает стартовый уровень, Pro добавляет практическую работу с поставщиками, Full дает полную траекторию до самостоятельной профессиональной роли.",
  },
  {
    question: "Как я получу материалы после оплаты?",
    answer:
      "После оплаты на указанный email придет письмо с защищенной ссылкой. По этой ссылке открываются материалы выбранного уровня или пакета профессии.",
  },
  {
    question: "Будет ли электронный сертификат?",
    answer:
      "После завершения образовательной программы предусмотрен электронный сертификат. Его можно использовать как подтверждение прохождения программы и освоенных тем.",
  },
];

const hrPageCopy = {
  professionCardDescription:
    "Практическая траектория для тех, кто хочет освоить подбор сотрудников, поиск кандидатов, работу с вакансиями и резюме, собеседования, оценку кандидатов, адаптацию новых сотрудников и развитие персонала.",
  audienceIntro:
    "Программа подойдет тем, кто хочет освоить практическую работу с людьми, кандидатами и сотрудниками и построить понятную карьерную траекторию в сфере кадров и персонала.",
  careerDescription: undefined,
  labels: {
    audience: "Для кого",
    packages: "Пакеты",
    careerPath: "Карьерный путь",
    result: "Результат",
    skills: "Навыки",
    levels: "Уровни",
  },
  statCards: [
    {
      title: "Карьерный старт",
      value: "Помощник в отделе кадров → специалист отдела кадров",
      description:
        "Путь начинается с поиска кандидатов, работы с вакансиями и резюме, первых собеседований и постепенно приводит к самостоятельной работе с подбором сотрудников и адаптацией новых сотрудников.",
    },
    {
      title: "Где применять",
      value: "4+ направления работы",
      description:
        "Специалисты отдела кадров работают с подбором сотрудников, поиском кандидатов, собеседованиями, оценкой кандидатов, адаптацией новых сотрудников и развитием персонала.",
    },
    {
      title: "Подтверждение",
      value: "Сертификат",
      description:
        "После завершения образовательной программы пользователь получает электронный сертификат.",
    },
  ],
  faqItems: [
    {
      question: "Можно ли начать без опыта в сфере кадров и персонала?",
      answer:
        "Да. Базовый уровень помогает спокойно войти в профессию: разобраться в подборе сотрудников, вакансиях, резюме, собеседованиях и первых задачах специалиста отдела кадров.",
    },
    {
      question: "Чем отличаются пакеты профессии?",
      answer:
        "Базовый пакет открывает стартовый уровень, практический пакет добавляет работу с подбором сотрудников, оценкой кандидатов и адаптацией новых сотрудников, а полная программа дает траекторию до самостоятельной роли в сфере кадров и персонала.",
    },
    {
      question: "Как я получу материалы после оплаты?",
      answer:
        "После оплаты на указанный email придет письмо с защищенной ссылкой. По этой ссылке открываются материалы выбранного уровня или пакета профессии.",
    },
    {
      question: "Будет ли электронный сертификат?",
      answer:
        "После завершения образовательной программы предусмотрен электронный сертификат. Его можно использовать как подтверждение прохождения программы и освоенных тем.",
    },
  ],
};

const tourismPageCopy = {
  professionCardDescription:
    "Практическая программа для тех, кто хочет освоить профессию специалиста по туризму: научиться работать с клиентами, подбирать туры, составлять маршруты и разбираться в туристических продуктах.",
  audienceIntro:
    "Программа подойдёт тем, кто хочет освоить практическую работу в сфере туризма, разобраться в туристических продуктах и научиться сопровождать клиента от первого запроса до завершения поездки.",
  careerDescription:
    "Последовательный путь от первых задач в туризме до самостоятельной работы с клиентами и туристическими продуктами.",
  labels: {
    audience: "ДЛЯ КОГО",
    packages: "ОБУЧЕНИЕ",
    careerPath: "КАРЬЕРНЫЙ ПУТЬ",
    result: "РЕЗУЛЬТАТ",
    skills: "НАВЫКИ",
    levels: "УРОВНИ ПРОГРАММЫ",
  },
  statCards: [
    {
      title: "Карьерный старт",
      value: "От помощника до специалиста",
      description:
        "Путь начинается с работы с заявками, подбора вариантов путешествий и общения с клиентами и постепенно приводит к самостоятельному ведению клиента.",
    },
    {
      title: "Где работать",
      value: "4+ направлений работы",
      description:
        "Навыки можно применять в турагентствах, у туроператоров, в гостиничном бизнесе, сервисах бронирования и при индивидуальном сопровождении путешествий.",
    },
    {
      title: "Подтверждение",
      value: "Сертификат",
      description:
        "После завершения образовательной программы пользователь получает электронный сертификат о прохождении обучения.",
    },
  ],
  faqItems: [
    {
      question: "Можно ли начать без опыта в туризме?",
      answer:
        "Да. Базовый уровень помогает разобраться в туристической отрасли, видах туристических продуктов, запросах клиентов и первых задачах специалиста по туризму.",
    },
    {
      question: "Чем отличаются пакеты профессии?",
      answer:
        "Базовый пакет открывает стартовый уровень, практический пакет добавляет работу с клиентскими запросами, подбором туров и маршрутами, а полная программа дает траекторию до самостоятельной работы с клиентами и туристическими продуктами.",
    },
    {
      question: "Как я получу материалы после оплаты?",
      answer:
        "После оплаты на указанный email придет письмо с защищенной ссылкой. По этой ссылке открываются материалы выбранного уровня или пакета профессии.",
    },
    {
      question: "Будет ли электронный сертификат?",
      answer:
        "После завершения образовательной программы предусмотрен электронный сертификат. Его можно использовать как подтверждение прохождения программы и освоенных тем.",
    },
  ],
};

const logisticsPageCopy = {
  professionCardDescription:
    "Практическая траектория для тех, кто хочет освоить международные перевозки, документы, участников внешнеэкономической деятельности и контроль логистических процессов.",
  audienceIntro:
    "Программа подойдёт тем, кто хочет войти в международную логистику, разобраться в перевозках, документах, сроках и участниках процесса без лишней теории.",
  careerDescription:
    "Последовательный путь от первых задач с заявками и документами до самостоятельного контроля международных перевозок.",
  labels: {
    audience: "ДЛЯ КОГО",
    packages: "ОБУЧЕНИЕ",
    careerPath: "КАРЬЕРНЫЙ ПУТЬ",
    result: "РЕЗУЛЬТАТ",
    skills: "НАВЫКИ",
    levels: "УРОВНИ ПРОГРАММЫ",
  },
  statCards: [
    {
      title: "Карьерный старт",
      value: "От координатора до специалиста",
      description:
        "Путь начинается с заявок, документов и контроля этапов перевозки и постепенно приводит к самостоятельной работе с международными поставками.",
    },
    {
      title: "Где работать",
      value: "4+ направлений работы",
      description:
        "Навыки востребованы в логистических компаниях, отделах ВЭД, транспортно-экспедиционных командах, торговых и производственных компаниях.",
    },
    {
      title: "Подтверждение",
      value: "Сертификат",
      description:
        "После завершения образовательной программы пользователь получает электронный сертификат о прохождении обучения.",
    },
  ],
  faqItems: [
    {
      question: "Можно ли начать без опыта в международной логистике?",
      answer:
        "Да. Базовый уровень рассчитан на спокойный вход: вы разберёте участников перевозки, документы, маршруты, сроки и первые задачи специалиста.",
    },
    {
      question: "Чем отличаются варианты обучения?",
      answer:
        "Базовый пакет открывает стартовый уровень, практический пакет добавляет работу с перевозками и документами, а полная программа даёт траекторию до самостоятельной роли.",
    },
    {
      question: "Когда будут доступны учебные материалы?",
      answer:
        "Страница профессии и структура программы уже подготовлены. Учебные материалы будут добавлены отдельным этапом после подготовки контента.",
    },
    {
      question: "Как будет выдаваться доступ?",
      answer:
        "После оплаты доступ к материалам будет отправляться на email в виде защищённой ссылки, без личного кабинета на первом этапе.",
    },
  ],
};

const aiPageCopy = {
  professionCardDescription:
    "Практическая программа для тех, кто хочет научиться применять искусственный интеллект в работе, бизнесе, создании материалов, анализе информации и ускорении задач.",
  audienceIntro:
    "Программа подойдёт тем, кто хочет освоить практическое применение искусственного интеллекта без сложного программирования и технической перегрузки.",
  careerDescription:
    "Последовательный путь от первых задач с ИИ до самостоятельного применения искусственного интеллекта в работе и проектах.",
  labels: {
    audience: "ДЛЯ КОГО",
    packages: "ОБУЧЕНИЕ",
    careerPath: "КАРЬЕРНЫЙ ПУТЬ",
    result: "РЕЗУЛЬТАТ",
    skills: "НАВЫКИ",
    levels: "УРОВНИ ПРОГРАММЫ",
  },
  statCards: [
    {
      title: "Карьерный старт",
      value: "От новичка до уверенного пользователя ИИ",
      description:
        "Путь начинается с понимания возможностей искусственного интеллекта, базовых инструментов и первых практических задач.",
    },
    {
      title: "Где применять",
      value: "5+ направлений работы",
      description:
        "Навыки можно применять в обучении, контенте, документах, маркетинге, аналитике, бизнес-процессах и личной эффективности.",
    },
    {
      title: "Подтверждение",
      value: "Сертификат",
      description:
        "После завершения образовательной программы пользователь получает электронный сертификат о прохождении обучения.",
    },
  ],
  faqItems: [
    {
      question: "Можно ли начать без технического опыта?",
      answer:
        "Да. Программа рассчитана на спокойный вход: вы начинаете с понятных ИИ-инструментов, простых запросов и практических задач без программирования.",
    },
    {
      question: "Чем отличаются варианты обучения?",
      answer:
        "Базовый пакет помогает познакомиться с ИИ, практический пакет добавляет регулярное применение в рабочих задачах, а полная программа дает траекторию до самостоятельной работы с ИИ-процессами.",
    },
    {
      question: "Где можно применять эти навыки?",
      answer:
        "Навыки пригодятся в создании текстов, документов, обучающих материалов, контента, анализе информации, планировании и ускорении рабочих процессов.",
    },
    {
      question: "Будет ли электронный сертификат?",
      answer:
        "После завершения образовательной программы предусмотрен электронный сертификат. Его можно использовать как подтверждение прохождения программы и освоенных тем.",
    },
  ],
};

function getProfessionIcon(slug: string) {
  if (slug === "hr") {
    return "users" as const;
  }

  if (slug === "tourism") {
    return "map" as const;
  }

  if (slug === "ai") {
    return "spark" as const;
  }

  return "briefcase" as const;
}

export async function generateMetadata({
  params,
}: ProfessionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profession = getProfession(slug);

  return {
    title: profession
      ? `${profession.title} | Профессия Академии`
      : "Профессия Академии",
    description: profession?.description,
  };
}

export default async function ProfessionPage({ params }: ProfessionPageProps) {
  const { slug } = await params;
  const profession = getProfession(slug);

  if (!profession) {
    notFound();
  }

  const levelSummary = profession.levels.map((level) => ({
    title: level.title,
    description: level.result,
  }));
  const pageCopy =
    profession.slug === "hr"
      ? hrPageCopy
      : profession.slug === "tourism"
        ? tourismPageCopy
        : profession.slug === "logistics"
          ? logisticsPageCopy
          : profession.slug === "ai"
            ? aiPageCopy
            : null;
  const sectionLabels = pageCopy?.labels ?? {
    audience: "Кому подойдёт",
    packages: "Пакеты",
    careerPath: "Карьерная траектория",
    result: "Результат",
    skills: "Навыки",
    levels: "Уровни программы",
  };

  return (
    <main className="min-h-screen bg-porcelain">
      <section className="pb-10 pt-10 md:pb-16 md:pt-14">
        <div className="container-shell">
          <a className="text-sm font-semibold text-ink/70 transition hover:text-ink" href="/">
            Вернуться на главную
          </a>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="min-w-0">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
                Профессия / {profession.direction}
              </p>
              <h1 className="max-w-4xl font-serif text-4xl leading-tight text-ink [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal] md:text-6xl">
                {profession.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
                {profession.description}
              </p>
              <p className="mt-5 max-w-3xl text-xl leading-9 text-ink">
                {profession.outcome}
              </p>
              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <a
                  className="rounded-full bg-ink px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-evergreen"
                  href="#packages"
                >
                  Выбрать пакет
                </a>
                <a
                  className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-bold text-ink transition hover:border-gold hover:text-evergreen"
                  href="#program"
                >
                  Смотреть структуру
                </a>
              </div>
            </div>

            <ProfessionCard
              ctaLabel="Перейти к пакетам"
              description={
                pageCopy?.professionCardDescription ??
                "Практическая траектория для тех, кто хочет освоить снабжение как понятную, прикладную и востребованную профессиональную функцию."
              }
              direction={profession.direction}
              href="#packages"
              icon={getProfessionIcon(profession.slug)}
              imageSrc={getProfessionImage(profession.slug)}
              priority
              status="Доступ после оплаты"
              title={profession.title}
            />
          </div>
        </div>
      </section>

      <section className="bg-ivory/55 py-14 md:py-16">
        <div className="container-shell grid gap-5 md:grid-cols-3">
          {(pageCopy?.statCards ?? [
            {
              title: "Карьерный старт",
              value: "Начальный уровень → Специалист",
              description:
                "Путь начинается с понятных операционных задач и постепенно приводит к самостоятельной работе с поставщиками.",
            },
            {
              title: "Где применять",
              value: "4+ формата работы",
              description:
                "Снабжение востребовано в производственных, торговых, сервисных и проектных командах.",
            },
            {
              title: "Подтверждение",
              value: "Сертификат",
              description:
                "После завершения образовательной программы вы получаете электронный сертификат.",
            },
          ]).map((card) => (
            <SalaryCard
              description={card.description}
              key={card.title}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              {sectionLabels.audience}
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Кому подойдет профессия
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-ink/68">
              {pageCopy?.audienceIntro ??
                "Программа подходит тем, кто хочет разобраться в практической бизнес-функции и получить понятную профессиональную траекторию."}
            </p>
          </div>
          <SkillsGrid skills={profession.audience} />
        </div>
      </section>

      <section className="bg-ink py-16 text-white md:py-20" id="packages">
        <div className="container-shell">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              {sectionLabels.packages}
            </p>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              {profession.slug === "tourism" ||
              profession.slug === "ai" ||
              profession.slug === "logistics"
                ? "Варианты обучения"
                : "Пакеты профессии"}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/68">
              Вы выбираете объем доступа: один уровень, два уровня или полную
              траекторию подготовки по профессии.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {profession.packages.map((item) => (
              <div className="grid gap-4" key={item.slug}>
                <ProgramCard
                  badge={item.badge}
                  ctaLabel="Выбрать пакет"
                  description={item.bestFor}
                  featured={item.featured}
                  href="/#access-form"
                  label={item.subtitle}
                  price={item.price}
                  result={item.result}
                  title={item.title}
                />
                <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/58">
                    Что входит
                  </p>
                  <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/76">
                    {item.includes.map((include) => (
                      <li className="border-t border-white/10 pt-3" key={include}>
                        {include}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-shell">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              {sectionLabels.careerPath}
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Карьерная траектория
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink/68">
              {pageCopy?.careerDescription ??
                "Это не просто набор материалов, а последовательный путь развития от первых задач до самостоятельной профессиональной роли."}
            </p>
          </div>

          <CareerPath steps={profession.careerPath} />
        </div>
      </section>

      <section className="bg-ivory/55 py-16 md:py-20">
        <div className="container-shell">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              {sectionLabels.result}
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Что вы сможете делать после программы
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ResultCard
              items={profession.learningResult.tasks}
              title="Задачи специалиста"
            />
            <ResultCard
              items={profession.learningResult.workplaces}
              title="Где применять"
            />
            <ResultCard items={levelSummary.map((item) => item.description)} title="Итог уровней" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" id="program">
        <div className="container-shell">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              {sectionLabels.skills}
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Навыки, которые формирует профессия
            </h2>
          </div>

          <SkillsGrid skills={profession.learningResult.skills} />
        </div>
      </section>

      <section className="bg-ivory/55 pb-14 pt-14 md:pb-16 md:pt-16">
        <div className="container-shell">
          <div className="mx-auto mb-7 max-w-3xl text-center md:mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              {sectionLabels.levels}
            </p>
            <h2 className="mx-auto max-w-lg text-left font-serif text-[1.875rem] leading-[1.08] text-ink [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal] md:text-[2.15rem]">
              {profession.slug === "tourism" ||
              profession.slug === "ai" ||
              profession.slug === "logistics" ? (
                "Уровни образовательной программы"
              ) : (
                <>
                  <span className="block">Уровни</span>
                  <span className="block">образова</span>
                  <span className="block">тельной</span>
                  <span className="block">программы</span>
                </>
              )}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-ink/68">
              Каждый уровень можно изучать отдельно или как часть выбранного
              пакета профессии.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {profession.levels.map((level) => (
              <ProgramCard
                compact
                ctaLabel="Выбрать пакет"
                description={level.description}
                duration={level.duration}
                href="#packages"
                imageAlt={`${profession.title}: ${level.title}`}
                imageSrc={
                  getProfessionLevelImage(profession.slug, level.slug)
                }
                imageObjectPosition={
                  profession.slug === "ai" && level.slug === "basic"
                    ? "center 42%"
                    : profession.slug === "ai" && level.slug === "practice"
                      ? "center 25%"
                      : undefined
                }
                key={level.slug}
                label={level.label}
                price={level.price}
                result={level.result}
                title={level.title}
              />
            ))}
          </div>
        </div>
      </section>

      <CertificateSection />

      <section className="py-16 md:py-20">
        <div className="container-shell">
          <AccessBlock steps={accessDeliverySteps} />
        </div>
      </section>

      <section className="bg-ivory/55 py-16 md:py-20">
        <div className="container-shell">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              FAQ
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Вопросы по профессии
            </h2>
          </div>
          <FAQ items={pageCopy?.faqItems ?? professionFaqItems} />
        </div>
      </section>
    </main>
  );
}
