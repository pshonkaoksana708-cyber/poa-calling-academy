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
import { JsonLd } from "@/components/JsonLd";
import { accessDeliverySteps } from "@/data/config/email";
import { getProfessionImage, getProfessionLevelImage } from "@/data/images";
import { getProfession, professions } from "@/data/professions";
import {
  breadcrumbListJsonLd,
  courseJsonLd,
  faqPageJsonLd,
  getProfessionSeo,
  seoMetadata,
} from "@/lib/seo";

type ProfessionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const professionFaqItems = [
  {
    question: "Можно ли начать обучение снабжению с нуля?",
    answer:
      "Да. Базовый уровень рассчитан на спокойный вход в профессию: вы разберете роль снабжения, закупочный цикл, заявки, поставщиков, документы и первые практические задачи.",
  },
  {
    question: "Чем отличаются пакеты профессии?",
    answer:
      "Базовый пакет открывает стартовый уровень, практический пакет добавляет работу с поставщиками и закупочными процессами, а полная программа дает траекторию до самостоятельной профессиональной роли.",
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

const supplyPageCopy = {
  professionCardDescription:
    "Практическая траектория для тех, кто хочет освоить снабжение и закупки с нуля: заявки, поставщики, документы, переговоры и контроль поставок.",
  heroDescription:
    "Освойте профессию специалиста по снабжению с нуля в онлайн-формате и научитесь работать с заявками, поставщиками, закупками, документами и поставками.",
  heroOutcome:
    "Программа помогает разобраться в закупочном цикле, работе снабженца и практических задачах специалиста по закупкам без лишней теории.",
  audienceIntro:
    "Курсы по снабжению подойдут тем, кто хочет войти в профессию с нуля, разобраться в закупках, заявках, поставщиках и документах и получить понятную траекторию обучения.",
  careerDescription:
    "Последовательный путь от первых задач в снабжении и закупках до самостоятельной работы с поставщиками, документами и контролем поставок.",
  labels: {
    audience: "Кому подойдёт",
    packages: "Пакеты",
    careerPath: "Карьерная траектория",
    result: "Результат",
    skills: "Навыки",
    levels: "Уровни программы",
  },
  headings: {
    audience: "Кому подойдут курсы по снабжению",
    result: "Что вы сможете делать после обучения снабжению",
    skills: "Навыки специалиста по снабжению и закупкам",
  },
  statCards: [
    {
      title: "Карьерный старт",
      value: "Начальный уровень → специалист",
      description:
        "Путь начинается с понятных задач по заявкам, документам и поставщикам и постепенно приводит к самостоятельной работе в снабжении.",
    },
    {
      title: "Где применять",
      value: "4+ формата работы",
      description:
        "Навыки снабжения и закупок востребованы в производственных, торговых, сервисных и проектных командах.",
    },
    {
      title: "Подтверждение",
      value: "Электронный сертификат",
      description:
        "После завершения образовательной программы пользователь получает электронный сертификат.",
    },
  ],
  faqItems: professionFaqItems,
};

const hrPageCopy = {
  professionCardDescription:
    "Практическая траектория для тех, кто хочет освоить кадры, подбор персонала, работу с вакансиями и резюме, собеседования, адаптацию сотрудников и развитие команды.",
  heroDescription:
    "В онлайн-формате научитесь находить сотрудников, проводить собеседования, адаптировать персонал и выстраивать работу с людьми — даже если раньше вы не работали в HR.",
  heroOutcome:
    "Программа объединяет понятные основы кадровой работы, подбор персонала, оценку кандидатов и практические задачи специалиста по кадрам.",
  audienceIntro:
    "Курс подойдёт тем, кто хочет освоить работу с кадрами и персоналом с нуля: подбор сотрудников, собеседования, адаптацию, коммуникацию и первые HR-задачи.",
  careerDescription:
    "Последовательный путь от базовой кадровой работы и подбора персонала до самостоятельных задач специалиста по кадрам и HR.",
  labels: {
    audience: "Для кого",
    packages: "Пакеты",
    careerPath: "Карьерный путь",
    result: "Результат",
    skills: "Навыки",
    levels: "Уровни",
  },
  headings: {
    audience: "Кому подойдёт обучение кадрам и подбору персонала",
    result: "Что вы сможете делать после обучения работе с персоналом",
    skills: "Навыки специалиста по кадрам и HR",
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
      question: "Подходит ли программа тем, кто ищет курсы по подбору персонала?",
      answer:
        "Да. В программе есть работа с вакансиями, резюме, кандидатами, собеседованиями, оценкой кандидатов и адаптацией новых сотрудников.",
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
    "Практическая программа для тех, кто хочет освоить профессию турагента: научиться работать с клиентами, подбирать туры, бронировать поездки и разбираться в туристических продуктах.",
  heroDescription:
    "Освойте профессию турагента с нуля: научитесь подбирать туры, работать с туристами, бронировать поездки и сопровождать клиента от первого обращения до путешествия.",
  heroOutcome:
    "Онлайн-обучение помогает разобраться в туристических продуктах, запросах клиентов, маршрутах, документах и практических задачах турагента.",
  audienceIntro:
    "Курс турагента подойдёт тем, кто хочет начать в туризме с нуля, научиться общаться с клиентами, подбирать туры и понимать логику бронирования.",
  careerDescription:
    "Последовательный путь от первых задач в туризме до самостоятельной работы турагента с клиентами, поездками и туристическими продуктами.",
  labels: {
    audience: "ДЛЯ КОГО",
    packages: "ОБУЧЕНИЕ",
    careerPath: "КАРЬЕРНЫЙ ПУТЬ",
    result: "РЕЗУЛЬТАТ",
    skills: "НАВЫКИ",
    levels: "УРОВНИ ПРОГРАММЫ",
  },
  headings: {
    audience: "Кому подойдёт курс турагента",
    result: "Что вы сможете делать после обучения на турагента",
    skills: "Навыки турагента для работы с клиентами и турами",
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
      question: "Можно ли пройти курс турагента с нуля?",
      answer:
        "Да. Базовый уровень помогает разобраться в туристической отрасли, видах туристических продуктов, запросах клиентов и первых задачах турагента.",
    },
    {
      question: "Что я буду уметь после обучения на турагента?",
      answer:
        "Вы разберёте подбор туров, работу с клиентскими запросами, маршруты, размещение, документы, бронирование и сопровождение клиента.",
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
    "Практическая траектория для тех, кто хочет освоить профессию логиста: транспортную и международную логистику, грузоперевозки, документы, маршруты и основы ВЭД.",
  heroDescription:
    "Освойте профессию логиста с нуля и научитесь организовывать перевозки, работать с маршрутами, грузами, документами и международными поставками.",
  heroOutcome:
    "Транспортная и международная логистика, грузоперевозки и ВЭД собраны в практическую программу для самостоятельного онлайн-обучения.",
  audienceIntro:
    "Курсы по логистике подойдут тем, кто хочет войти в профессию логиста с нуля, разобраться в перевозках, документах, маршрутах, грузах и международных поставках.",
  careerDescription:
    "Последовательный путь от первых задач с заявками, маршрутами и документами до самостоятельного контроля транспортной и международной логистики.",
  labels: {
    audience: "ДЛЯ КОГО",
    packages: "ОБУЧЕНИЕ",
    careerPath: "КАРЬЕРНЫЙ ПУТЬ",
    result: "РЕЗУЛЬТАТ",
    skills: "НАВЫКИ",
    levels: "УРОВНИ ПРОГРАММЫ",
  },
  headings: {
    audience: "Кому подойдут курсы по логистике",
    result: "Что вы сможете делать после обучения логистике",
    skills: "Навыки логиста для перевозок, документов и ВЭД",
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
      question: "Можно ли начать обучение логистике с нуля?",
      answer:
        "Да. Базовый уровень рассчитан на спокойный вход: вы разберёте участников перевозки, документы, маршруты, грузы, сроки и первые задачи логиста.",
    },
    {
      question: "Чем международная логистика отличается от общего обучения логиста?",
      answer:
        "Программа сохраняет базовую логику профессии логиста и дополнительно показывает международные поставки, документы, участников ВЭД и контроль логистических процессов.",
    },
    {
      question: "Чем отличаются варианты обучения?",
      answer:
        "Базовый пакет открывает стартовый уровень, практический пакет добавляет работу с перевозками и документами, а полная программа даёт траекторию до самостоятельной роли.",
    },
    {
      question: "Как проходит онлайн-обучение логистике?",
      answer:
        "После оплаты пользователь получает защищённую ссылку на материалы выбранного пакета и изучает уроки в самостоятельном темпе.",
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
    "Практическая программа для тех, кто хочет освоить нейросети и искусственный интеллект с нуля и применять AI-инструменты в работе, бизнесе, контенте и проектах.",
  heroDescription:
    "Освойте нейросети с нуля и научитесь применять искусственный интеллект для текста, изображений, видео, рабочих задач и собственных проектов.",
  heroOutcome:
    "Практический онлайн-курс по нейросетям помогает разобраться в AI-инструментах без сложного программирования и технической перегрузки.",
  audienceIntro:
    "Курсы по нейросетям подойдут начинающим, предпринимателям, специалистам и тем, кто хочет применять искусственный интеллект в работе без сложного программирования.",
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
  headings: {
    audience: "Кому подойдут курсы по нейросетям",
    result: "Что вы сможете делать после обучения нейросетям",
    skills: "Навыки работы с нейросетями и искусственным интеллектом",
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
      question: "Можно ли начать изучать нейросети без технического опыта?",
      answer:
        "Да. Программа рассчитана на спокойный вход: вы начинаете с понятных AI-инструментов, простых запросов и практических задач без программирования.",
    },
    {
      question: "Что входит в обучение искусственному интеллекту и нейросетям?",
      answer:
        "В программе есть работа с текстом, изображениями, документами, анализом информации, рабочими задачами и практическим применением AI-инструментов.",
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
  const seo = profession ? getProfessionSeo(profession) : null;

  return {
    ...(profession && seo
      ? seoMetadata({
          description: seo.description,
          path: `/profession/${profession.slug}`,
          title: seo.title,
        })
      : {
          title: "Профессия Академии",
        }),
  };
}

export default async function ProfessionPage({ params }: ProfessionPageProps) {
  const { slug } = await params;
  const profession = getProfession(slug);

  if (!profession) {
    notFound();
  }

  const seo = getProfessionSeo(profession);
  const levelSummary = profession.levels.map((level) => ({
    title: level.title,
    description: level.result,
  }));
  const pageCopy =
    profession.slug === "supply"
      ? supplyPageCopy
      : profession.slug === "hr"
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
  const faqItems = pageCopy?.faqItems ?? professionFaqItems;
  const relatedProfessions = professions.filter(
    (item) => item.slug !== profession.slug,
  );
  const professionPath = `/profession/${profession.slug}`;
  const structuredData = [
    courseJsonLd({
      description: seo.description,
      name: profession.title,
      path: professionPath,
    }),
    breadcrumbListJsonLd([
      {
        name: "Главная",
        path: "/",
      },
      {
        name: profession.title,
        path: professionPath,
      },
    ]),
    faqPageJsonLd(faqItems),
  ];

  return (
    <main className="min-h-screen bg-porcelain">
      <JsonLd data={structuredData} />
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
                {seo.h1}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
                {pageCopy?.heroDescription ?? profession.description}
              </p>
              <p className="mt-5 max-w-3xl text-xl leading-9 text-ink">
                {pageCopy?.heroOutcome ?? profession.outcome}
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
              {pageCopy?.headings?.audience ?? "Кому подойдет профессия"}
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
                  href={`/?profession=${profession.slug}&package=${item.slug}#access-form`}
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
              {pageCopy?.headings?.result ??
                "Что вы сможете делать после программы"}
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
              {pageCopy?.headings?.skills ??
                "Навыки, которые формирует профессия"}
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
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              Другие направления
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Другие профессии Академии
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink/68">
              Вы можете сравнить программы и выбрать направление, которое
              ближе к вашим профессиональным задачам.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedProfessions.map((item) => (
              <a
                className="rounded-3xl border border-ink/10 bg-ivory p-6 text-ink shadow-soft transition hover:border-gold/50 hover:text-evergreen"
                href={`/profession/${item.slug}`}
                key={item.slug}
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  {item.direction}
                </p>
                <h3 className="mt-4 font-serif text-2xl leading-tight">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-ink/66">
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

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
          <FAQ items={faqItems} />
        </div>
      </section>
    </main>
  );
}
