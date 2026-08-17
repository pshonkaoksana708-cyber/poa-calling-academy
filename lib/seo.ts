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
      "Онлайн-программа по искусственному интеллекту и нейросетям: тексты, изображения, документы, анализ информации и практические AI-инструменты.",
    h1: "Специалист по искусственному интеллекту: обучение онлайн",
    title: "Искусственный интеллект — обучение с нуля",
  },
  hr: {
    description:
      "Практическое онлайн-обучение HR: подбор сотрудников, вакансии, резюме, интервью, адаптация и развитие персонала с нуля.",
    h1: "HR-специалист: обучение работе с персоналом",
    title: "HR-специалист — обучение работе с персоналом",
  },
  logistics: {
    description:
      "Онлайн-программа по международной логистике: перевозки, документы, участники ВЭД, контроль сроков, маршрутов и логистических процессов.",
    h1: "Специалист по международной логистике: обучение онлайн",
    title: "Международная логистика — обучение профессии",
  },
  supply: {
    description:
      "Онлайн-обучение профессии специалиста по снабжению: заявки, закупочный цикл, поставщики, документы, переговоры и аналитика закупок.",
    h1: "Специалист по снабжению: обучение профессии онлайн",
    title: "Специалист по снабжению — обучение онлайн",
  },
  tourism: {
    description:
      "Онлайн-обучение туризму: работа с клиентами, подбор туров, маршруты, документы, сервис и практические задачи специалиста по туризму.",
    h1: "Специалист по туризму: обучение профессии онлайн",
    title: "Специалист по туризму — обучение онлайн",
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
