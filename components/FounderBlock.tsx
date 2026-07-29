import { EditorialImage } from "@/components/EditorialImage";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/images";

export function FounderBlock() {
  const principles = [
    "практика вместо абстрактной теории",
    "понятная структура",
    "уважительный темп обучения",
    "фокус на новых профессиональных возможностях",
  ];

  return (
    <section className="section-space" id="author">
      <div className="container-shell grid items-center gap-14 lg:grid-cols-[0.92fr_1fr]">
        <div className="grid gap-5">
          <EditorialImage
            alt="Автор образовательных программ"
            className="md:min-h-[520px]"
            label="Фотография автора образовательных программ"
            src={siteImages.founderAbout}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <EditorialImage
              alt="Портрет автора образовательных программ"
              aspect="wide"
              className="shadow-none"
              icon="users"
              label="Дополнительный портрет автора"
              sizes="(min-width: 1024px) 24vw, 50vw"
              src={siteImages.founderPortrait}
            />
            <EditorialImage
              alt="Рабочий процесс автора образовательных программ"
              aspect="wide"
              className="shadow-none"
              icon="spark"
              label="Рабочий процесс автора"
              sizes="(min-width: 1024px) 24vw, 50vw"
              src={siteImages.founderDetail}
            />
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="АВТОР"
            title="Об авторе образовательных программ"
            description="Автор практических образовательных программ"
          />
          <div className="space-y-6 text-lg leading-9 text-ink/72">
            <p>
              Программы созданы на основе реального опыта в управлении,
              продажах, работе с клиентами, обучении сотрудников и запуске
              собственных проектов.
            </p>
            <p>
              За плечами автора — 14 лет предпринимательского опыта,
              собственные магазины и салоны красоты, а также 14 лет работы в
              найме, включая управленческую роль, наставничество, обучение
              сотрудников, выполнение планов и работу с клиентами.
            </p>
            <p>
              После ухода из найма появилась цель — создавать понятные
              образовательные программы для людей, которые хотят сменить
              профессию, вернуться к работе, освоить новое направление или
              собрать новую профессиональную траекторию без хаоса, перегруза и
              лишних обещаний.
            </p>
            <p>
              В основе Академии — практика, понятная структура, уважение к
              ученику и фокус на реальных профессиональных задачах.
            </p>
          </div>
          <div className="mt-8 grid gap-3">
            {principles.map((item) => (
              <div
                className="rounded-2xl border border-ink/10 bg-ivory px-5 py-4 text-ink/76"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
