import type { Metadata } from "next";
import { CertificateVerifier } from "./CertificateVerifier";

export const metadata: Metadata = {
  title: "Проверка сертификата",
  description:
    "Проверка подлинности сертификата Академии профессионального развития.",
};

export default function VerifyCertificatePage() {
  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <a className="text-sm font-semibold text-ink/70 transition hover:text-ink" href="/">
          Вернуться на главную
        </a>

        <div className="mt-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Сертификаты
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
            Проверка сертификата
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/68 md:text-lg">
            Введите регистрационный номер сертификата для проверки подлинности.
          </p>
        </div>

        <CertificateVerifier />
      </section>
    </main>
  );
}
