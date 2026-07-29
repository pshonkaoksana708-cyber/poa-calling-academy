type CertificateReadyBlockProps = {
  certificateId: string;
};

export function CertificateReadyBlock({ certificateId }: CertificateReadyBlockProps) {
  return (
    <section className="mt-8 rounded-3xl border border-gold/30 bg-gold/10 p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
        Электронный сертификат
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">
        Ваш сертификат готов
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-ink/68">
        Сертификат можно открыть по регистрационному номеру и проверить в
        реестре Академии профессионального развития.
      </p>
      <div className="mt-7 flex flex-col gap-4 sm:flex-row">
        <a
          className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
          href={`/verify/${certificateId}`}
        >
          Посмотреть сертификат
        </a>
        <a
          className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
          href="/verify"
        >
          Проверить сертификат
        </a>
      </div>
    </section>
  );
}
