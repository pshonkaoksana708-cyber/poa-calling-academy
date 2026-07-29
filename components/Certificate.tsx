type CertificateProps = {
  title?: string;
  programTitle: string;
  recipient?: string;
};

export function Certificate({
  title = "Электронный сертификат",
  programTitle,
  recipient = "Имя ученика",
}: CertificateProps) {
  return (
    <div className="rounded-[2rem] border border-gold/40 bg-ivory p-6 shadow-soft md:p-10">
      <div className="rounded-3xl border border-ink/10 bg-porcelain p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
          POA CALLING — Академия профессионального развития
        </p>
        <h3 className="mt-8 font-serif text-4xl leading-tight text-ink">
          {title}
        </h3>
        <p className="mt-6 text-sm text-ink/58">подтверждает прохождение</p>
        <p className="mx-auto mt-3 max-w-xl text-xl font-semibold leading-8 text-ink">
          {programTitle}
        </p>
        <p className="mt-8 font-serif text-3xl text-evergreen">{recipient}</p>
      </div>
    </div>
  );
}
