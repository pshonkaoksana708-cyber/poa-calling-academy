import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCertificateById } from "@/data/certificates";

type CertificatePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getStatusLabel(status: "active" | "revoked") {
  return status === "active" ? "Действителен" : "Недействителен";
}

function VerificationQrLink({ certificateId }: { certificateId: string }) {
  const verifyHref = `/verify/${certificateId}`;

  return (
    <a
      aria-label={`Проверить сертификат ${certificateId}`}
      className="group block rounded-3xl border border-ink/10 bg-ivory p-4 transition hover:border-gold/60"
      href={verifyHref}
    >
      <div className="grid aspect-square w-full max-w-[180px] grid-cols-7 gap-1 rounded-2xl bg-porcelain p-3">
        {Array.from({ length: 49 }).map((_, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const finder =
            (row < 3 && col < 3) ||
            (row < 3 && col > 3) ||
            (row > 3 && col < 3);
          const pattern = finder || (row * 3 + col * 5 + certificateId.length) % 4 === 0;

          return (
            <span
              className={pattern ? "rounded-[3px] bg-ink" : "rounded-[3px] bg-ink/8"}
              key={`${row}-${col}`}
            />
          );
        })}
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">
        QR-проверка
      </p>
      <p className="mt-2 text-sm leading-6 text-ink/68 group-hover:text-ink">
        {verifyHref}
      </p>
    </a>
  );
}

export async function generateMetadata({
  params,
}: CertificatePageProps): Promise<Metadata> {
  const { id } = await params;
  const certificate = getCertificateById(id);

  return {
    title: certificate
      ? `Сертификат ${certificate.id}`
      : "Сертификат не найден",
    description: certificate
      ? `Сертификат образовательной программы «${certificate.courseName}».`
      : "Просмотр сертификата Академии профессионального развития.",
  };
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { id } = await params;
  const certificate = getCertificateById(id);

  if (!certificate) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <a
          className="text-sm font-semibold text-ink/70 transition hover:text-ink"
          href="/verify"
        >
          Перейти к проверке сертификата
        </a>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <article className="rounded-[2rem] border border-gold/35 bg-ivory p-6 shadow-soft md:p-12">
            <div className="relative aspect-[1.333/1] overflow-hidden rounded-3xl border border-ink/10 bg-porcelain">
              <Image
                alt={`Сертификат ${certificate.id}`}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 70vw, 100vw"
                src="/images/certificates/certificate-template.png"
              />
            </div>
          </article>

          <aside className="grid gap-5">
            <VerificationQrLink certificateId={certificate.id} />
            <div className="rounded-3xl border border-ink/10 bg-ivory p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                Статус
              </p>
              <p className="mt-3 text-lg font-semibold text-evergreen">
                {getStatusLabel(certificate.status)}
              </p>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-ivory p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                Навыки
              </p>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink/70">
                {certificate.skills.map((skill) => (
                  <li className="rounded-2xl border border-ink/10 bg-porcelain p-3" key={skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-semibold text-ink/45"
              disabled
              type="button"
            >
              Скачать сертификат PDF
            </button>
            <p className="text-xs leading-6 text-ink/55">
              Скачивание PDF подготовлено в интерфейсе и будет подключено после
              добавления генерации файла.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
