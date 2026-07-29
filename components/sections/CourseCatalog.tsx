import { professions } from "@/data/professions";
import { EditorialImage } from "@/components/EditorialImage";
import { SectionHeading } from "@/components/SectionHeading";

const homepageLevelTitles: Record<string, string> = {
  basic: "Базовый уровень",
  practice: "Практический уровень",
  pro: "Профессиональный уровень",
};

const catalogImages: Record<string, string> = {
  supply: "/images/supply/supply-02.jpg",
  logistics: "/images/logistics/logistics-hero.jpg",
  hr: "/images/team/team-02.jpg",
  tourism: "/images/supply/supply-05.jpg",
  ai: "/images/professions/professions-02.jpg",
};

function getProfessionIcon(slug: string) {
  if (slug === "hr") {
    return "users";
  }

  if (slug === "tourism") {
    return "map";
  }

  if (slug === "ai") {
    return "spark";
  }

  return "briefcase";
}

export function CourseCatalog() {
  return (
    <section className="section-space bg-ink text-white" id="catalog">
      <div className="container-shell">
        <SectionHeading
          eyebrow="ПРОГРАММЫ"
          title="Каталог образовательных программ"
          description="Каталог рассчитан на масштабирование: снабжение, HR, искусственный интеллект, туризм, управление, продажи, предпринимательство, финансы и другие направления подготовки."
        />
        <div className="grid gap-4">
          {professions.map((profession) => (
            <article
              className="min-w-0 overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/60 md:p-6"
              key={profession.slug}
            >
              <div className="grid min-w-0 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="min-w-0">
                  <EditorialImage
                    alt={profession.title}
                    aspect="wide"
                    className="mb-5 shadow-none"
                    icon={getProfessionIcon(profession.slug)}
                    label={`Визуал направления “${profession.direction}”`}
                    src={catalogImages[profession.slug]}
                  />
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                    Профессия / {profession.direction}
                  </p>
                  <h3 className="mt-5 max-w-full font-serif text-[1.75rem] leading-[1.1] [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal] md:text-[2rem] xl:text-4xl">
                    {profession.title}
                  </h3>
                  <p className="mt-4 max-w-xl leading-7 text-white/70">
                    {profession.description}
                  </p>
                  <a
                    className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-white"
                    href={`/profession/${profession.slug}`}
                  >
                    Перейти к программе
                  </a>
                </div>

                <div className="grid min-w-0 gap-4 self-start md:grid-cols-2 xl:grid-cols-3">
                  {profession.levels.map((level) => (
                    <a
                      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] p-5 transition hover:border-gold/60 hover:bg-white/[0.07]"
                      href={`/profession/${profession.slug}#packages`}
                      key={level.slug}
                    >
                      <span className="block min-w-0 text-xs font-bold uppercase tracking-[0.2em] text-gold [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal]">
                        {level.label}
                      </span>
                      <span className="mt-4 block max-w-full font-serif text-[1.375rem] leading-[1.12] [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal] md:text-[1.5rem] xl:text-[1.75rem] xl:leading-[1.1]">
                        {homepageLevelTitles[level.slug] ?? level.title}
                      </span>
                      <span className="mt-5 grid gap-2 text-sm text-white/68">
                        <span>{level.duration}</span>
                        <span>{level.price}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
