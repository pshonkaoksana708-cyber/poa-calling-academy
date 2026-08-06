import { SectionHeading } from "@/components/SectionHeading";

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
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-mist bg-ivory shadow-soft md:min-h-[520px]">
            <img
              src="/images/author/author-02.webp"
              alt="Автор"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-mist bg-ivory">
              <img
                src="/images/author/author-03.webp"
                alt="Автор"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-mist bg-ivory">
              <img
                src="/images/author/author-06.webp"
                alt="Автор"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
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
