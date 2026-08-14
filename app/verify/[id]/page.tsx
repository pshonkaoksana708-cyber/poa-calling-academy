import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificateCard } from "@/components/CertificateCard";
import { getCertificateById } from "@/data/certificates";
import { publicSeo } from "@/lib/seo";

type VerifyCertificateDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: VerifyCertificateDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const certificate = getCertificateById(id);

  return {
    ...publicSeo(`/verify/${id}`),
    title: certificate
      ? `Сертификат ${certificate.id}`
      : "Сертификат не найден",
    description: certificate
      ? `Проверка сертификата образовательной программы «${certificate.courseName}».`
      : "Проверка подлинности сертификата Академии профессионального развития.",
  };
}

export default async function VerifyCertificateDetailsPage({
  params,
}: VerifyCertificateDetailsPageProps) {
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
          Проверить другой сертификат
        </a>

        <div className="mt-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Проверка сертификата
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
            Сертификат подтверждён
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/68 md:text-lg">
            Информация ниже подтверждает наличие сертификата в реестре Академии
            профессионального развития.
          </p>
        </div>

        <div className="mt-10">
          <CertificateCard certificate={certificate} />
        </div>
      </section>
    </main>
  );
}
