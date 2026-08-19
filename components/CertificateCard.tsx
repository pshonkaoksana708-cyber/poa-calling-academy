import Image from "next/image";
import type { AcademyCertificate } from "@/data/certificates";

type CertificateCardProps = {
  certificate: AcademyCertificate;
};

function getStatusLabel(status: AcademyCertificate["status"]) {
  return status === "active" ? "Действителен" : "Недействителен";
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="relative min-h-[300px] bg-porcelain lg:min-h-full">
          <Image
            alt="Макет сертификата POA CALLING — Академии профессионального развития"
            className="object-cover"
            fill
            priority={false}
            sizes="(min-width: 1024px) 42vw, 100vw"
            src="/media/images/certificates/certificate-template.png"
          />
        </div>

        <div className="p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-gold">
            POA CALLING — Академия профессионального развития
          </p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-5xl">
            Сертификат подтверждён
          </h2>

          <dl className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-ink/10 bg-porcelain p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                Номер сертификата
              </dt>
              <dd className="mt-2 text-base font-semibold text-ink">
                {certificate.id}
              </dd>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-porcelain p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                ФИО выпускника
              </dt>
              <dd className="mt-2 text-base font-semibold text-ink">
                {certificate.studentName || "Будет указано после выдачи"}
              </dd>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-porcelain p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                Образовательная программа
              </dt>
              <dd className="mt-2 text-base font-semibold text-ink">
                {certificate.courseName}
              </dd>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink/10 bg-porcelain p-4">
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                  Дата выдачи
                </dt>
                <dd className="mt-2 text-base font-semibold text-ink">
                  {certificate.date || "Будет указана после выдачи"}
                </dd>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-porcelain p-4">
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                  Часы обучения
                </dt>
                <dd className="mt-2 text-base font-semibold text-ink">
                  {certificate.hours}
                </dd>
              </div>
            </div>
            <div className="rounded-2xl border border-gold/35 bg-gold/10 p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                Статус
              </dt>
              <dd className="mt-2 text-base font-semibold text-evergreen">
                {getStatusLabel(certificate.status)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
