import type { Metadata } from "next";

export const siteUrl = "https://www.poacalling.com";
export const organizationName =
  "POA CALLING — Академия профессионального развития";
export const defaultOpenGraphImage = "/images/hero/academy-og.jpg";
export const defaultOpenGraphAlt = organizationName;

export const noIndexRobots = {
  follow: false,
  googleBot: {
    follow: false,
    index: false,
  },
  index: false,
} satisfies Metadata["robots"];

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}

export function publicSeo(path: string): Metadata {
  return {
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      images: [
        {
          alt: defaultOpenGraphAlt,
          url: defaultOpenGraphImage,
        },
      ],
      url: absoluteUrl(path),
    },
    twitter: {
      card: "summary_large_image",
      images: [defaultOpenGraphImage],
    },
  };
}

export function getSiteVerificationMetadata(): Metadata["verification"] | undefined {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;

  if (!google && !yandex) {
    return undefined;
  }

  return {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@id": `${siteUrl}/#organization`,
    "@type": "Organization",
    name: organizationName,
    url: siteUrl,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@id": `${siteUrl}/#website`,
    "@type": "WebSite",
    inLanguage: "ru-RU",
    name: "POA CALLING",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    url: siteUrl,
  };
}

export function courseJsonLd(input: {
  description: string;
  name: string;
  path: string;
}) {
  const url = absoluteUrl(input.path);

  return {
    "@context": "https://schema.org",
    "@id": `${url}#course`,
    "@type": "Course",
    description: input.description,
    inLanguage: "ru-RU",
    name: input.name,
    provider: {
      "@id": `${siteUrl}/#organization`,
      "@type": "Organization",
      name: organizationName,
      url: siteUrl,
    },
    url,
  };
}

export function breadcrumbListJsonLd(
  items: Array<{
    name: string;
    path: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function faqPageJsonLd(
  items: Array<{
    answer: string;
    question: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
      name: item.question,
    })),
  };
}

type SeoCopy = {
  description: string;
  h1: string;
  title: string;
};

type ProfessionLike = {
  description: string;
  slug: string;
  title: string;
};

type LevelLike = {
  description: string;
  slug: string;
  title: string;
};

export const homeSeo: SeoCopy = {
  description:
    "POA CALLING — онлайн-академия профессий: практические программы для смены карьеры, самостоятельного обучения и развития профессиональных навыков.",
  h1: "Академия онлайн-профессий",
  title: "Онлайн-обучение новым профессиям | POA CALLING",
};

const professionSeoBySlug: Record<string, SeoCopy> = {
  ai: {
    description:
      "Практическое онлайн-обучение нейросетям и искусственному интеллекту с нуля. Работа с текстом, изображениями, видео и AI-инструментами для работы и бизнеса.",
    h1: "Специалист по нейросетям и искусственному интеллекту",
    title: "Курсы по нейросетям с нуля — обучение ИИ для начинающих онлайн",
  },
  hr: {
    description:
      "Онлайн-обучение работе с кадрами и персоналом с нуля: подбор сотрудников, собеседования, адаптация, оценка и работа с командой. Практическая программа для новой профессии.",
    h1: "Специалист по кадрам и подбору персонала (HR)",
    title: "Курсы HR и кадров с нуля — обучение подбору и работе с персоналом",
  },
  logistics: {
    description:
      "Онлайн-обучение профессии логиста с нуля. Транспортная и международная логистика, грузоперевозки, документы и основы ВЭД. Практическая программа обучения.",
    h1: "Логист: обучение профессии с нуля",
    title: "Курсы по логистике с нуля — обучение логиста онлайн",
  },
  supply: {
    description:
      "Онлайн-обучение профессии специалиста по снабжению с нуля. Закупки, поставщики, документы, переговоры и практические задачи. Выберите подходящий уровень программы.",
    h1: "Специалист по снабжению: обучение профессии с нуля",
    title: "Курсы по снабжению с нуля — обучение специалиста по снабжению онлайн",
  },
  tourism: {
    description:
      "Онлайн-курс турагента с нуля: подбор туров, работа с клиентами, бронирование, продажи и практические задачи. Освойте профессию турагента в удобном темпе.",
    h1: "Турагент: обучение профессии с нуля онлайн",
    title: "Курсы турагента с нуля онлайн — обучение профессии турагента",
  },
};

const professionSearchNameBySlug: Record<string, string> = {
  ai: "искусственному интеллекту",
  hr: "HR и управлению персоналом",
  logistics: "международной логистике",
  supply: "снабжению",
  tourism: "туризму",
};

const levelSeoBySlug = {
  basic: {
    descriptionPrefix: "Базовая программа",
    h1Suffix: "базовая программа обучения",
    titleSuffix: "базовая программа обучения",
  },
  practice: {
    descriptionPrefix: "Практический уровень",
    h1Suffix: "практический уровень обучения",
    titleSuffix: "практический уровень",
  },
  pro: {
    descriptionPrefix: "Профессиональная программа",
    h1Suffix: "профессиональная программа обучения",
    titleSuffix: "профессиональная программа",
  },
} as const;

export function seoMetadata(input: {
  description: string;
  path: string;
  title: string;
}): Metadata {
  return {
    ...publicSeo(input.path),
    description: input.description,
    openGraph: {
      ...publicSeo(input.path).openGraph,
      description: input.description,
      title: `${input.title} | POA CALLING`,
    },
    title: input.title,
    twitter: {
      ...publicSeo(input.path).twitter,
      description: input.description,
      title: `${input.title} | POA CALLING`,
    },
  };
}

export function getProfessionSeo(profession: ProfessionLike): SeoCopy {
  return professionSeoBySlug[profession.slug] ?? {
    description: profession.description,
    h1: `${profession.title}: обучение онлайн`,
    title: `${profession.title} — обучение онлайн`,
  };
}

export function getLevelSeo(input: {
  level: LevelLike;
  profession: ProfessionLike;
}): SeoCopy {
  const levelSeo = levelSeoBySlug[input.level.slug as keyof typeof levelSeoBySlug];
  const professionSearchName =
    professionSearchNameBySlug[input.profession.slug] ??
    input.profession.title.toLocaleLowerCase("ru-RU");

  if (!levelSeo) {
    return {
      description: input.level.description,
      h1: `${input.profession.title} — ${input.level.title.toLocaleLowerCase("ru-RU")}`,
      title: `${input.profession.title} — ${input.level.title.toLocaleLowerCase("ru-RU")}`,
    };
  }

  return {
    description: `${levelSeo.descriptionPrefix} «${input.profession.title}»: онлайн-обучение по ${professionSearchName} с учебными материалами, практическими заданиями и самостоятельным темпом.`,
    h1: `${input.profession.title} — ${levelSeo.h1Suffix}`,
    title: `${input.profession.title} — ${levelSeo.titleSuffix}`,
  };
}
