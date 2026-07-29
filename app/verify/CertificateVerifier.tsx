"use client";

import { useState } from "react";
import { CertificateCard } from "@/components/CertificateCard";
import { certificates, getCertificateById } from "@/data/certificates";

export function CertificateVerifier() {
  const [certificateId, setCertificateId] = useState("DEMO-2026-000001");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const certificate = submittedId ? getCertificateById(submittedId) : undefined;

  return (
    <div className="mt-10">
      <form
        className="rounded-3xl border border-ink/10 bg-ivory p-5 shadow-soft md:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedId(certificateId);
        }}
      >
        <label
          className="text-sm font-semibold text-ink"
          htmlFor="certificate-id"
        >
          Регистрационный номер сертификата
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <input
            className="min-h-14 rounded-full border border-ink/15 bg-porcelain px-5 text-base font-semibold text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-gold"
            id="certificate-id"
            onChange={(event) => setCertificateId(event.target.value)}
            placeholder="DEMO-2026-000001"
            type="text"
            value={certificateId}
          />
          <button
            className="rounded-full bg-ink px-7 py-4 text-sm font-semibold text-white transition hover:bg-evergreen disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!certificateId.trim()}
            type="submit"
          >
            Проверить сертификат
          </button>
        </div>
      </form>

      {submittedId ? (
        <div className="mt-8">
          {certificate ? (
            <div className="grid gap-5">
              <CertificateCard certificate={certificate} />
              <div className="rounded-3xl border border-ink/10 bg-ivory p-5 text-sm leading-7 text-ink/68 shadow-soft md:p-6">
                <p>
                  QR-код сертификата должен вести на страницу проверки:
                  {" "}
                  <a
                    className="font-semibold text-evergreen underline decoration-gold/50 underline-offset-4"
                    href={`/verify/${certificate.id}`}
                  >
                    /verify/{certificate.id}
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-8">
              <p className="font-serif text-3xl leading-tight text-ink">
                Сертификат с таким номером не найден.
              </p>
              <p className="mt-4 text-base leading-8 text-ink/68">
                Проверьте номер сертификата и повторите запрос.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-ink/10 bg-ivory p-6 text-sm leading-7 text-ink/68 shadow-soft md:p-8">
          <p>
            Сейчас в MVP-реестре подготовлен пример номера:
            {" "}
            <span className="font-semibold text-ink">{certificates[0]?.id}</span>.
          </p>
        </div>
      )}
    </div>
  );
}
