import { professions } from "@/data/professions";
import { EditorialImage } from "@/components/EditorialImage";
import { SectionHeading } from "@/components/SectionHeading";

const catalogImages: Record<string, string> = {
  supply: "/images/supply/supply-02.jpg",
  logistics: "/images/logistics/logistics-hero.jpg",
  hr: "/images/team/team-02.jpg",
  tourism: "/images/supply/supply-05.jpg",
  ai: "/images/professions/professions-02.jpg",
  admin: "/images/professions/admin-client-service.jpeg",
  marketplaces: "/images/education/education-01.jpg",
};

function getProfessionIcon(slug: string) {
  if (slug === "hr") return "users";
  if (slug === "tourism") return "map";
  if (slug === "ai") return "spark";
  return "briefcase";
}

export function CourseCatalog() {
  return (
    <section className="section-space bg-ink text-white" id="catalog">
      <div className="container-shell">
        <SectionHeading
          eyebrow="ПРОФЕССИИ"
          title="Выберите профессию"
          description="Каждое направление — один полный практический курс. Сразу видно, чему вы научитесь, какой результат получите и сколько стоит обучение."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {professions.map((profession) => {
            const course = profession.packages[0];
            const skills = course?.includes.slice(0, 5) ?? profession.learningResult.skills.slice(0, 5);

            return (
              <article
                className="min-w-0 overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/60 md:p-6"
                key={profession.slug}
              >
                <EditorialImage
                  alt={profession.title}
                  aspect="wide"
                  className="mb-5 shadow-none"
                  icon={getProfessionIcon(profession.slug)}
                  label={profession.direction}
                  src={catalogImages[profession.slug]}
                />

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  Полный курс · теория + практика
                </p>
                <h3 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
                  {profession.title}
                </h3>
                <p className="mt-3 leading-7 text-white/70">
                  {profession.description}
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-sm font-bold text-white">Вы научитесь:</p>
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/72">
                    {skills.map((skill) => (
                      <li className="flex gap-2" key={skill}>
                        <span className="text-gold">✓</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/48">Полный курс</p>
                    <p className="mt-1 font-serif text-2xl text-white">{course?.price}</p>
                  </div>
                  <a
                    className="inline-flex rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-white"
                    href={`/profession/${profession.slug}`}
                  >
                    Подробнее о курсе
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
