"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { siteImages } from "@/data/images";
import { professions } from "@/data/professions";

const packageTitles: Record<string, string> = {
  basic: "Базовый уровень",
  pro: "Практический уровень",
  full: "Профессиональный уровень",
};

function AccessVisual() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[2rem] border border-mist bg-ivory shadow-soft">
      {imageFailed ? (
        <div className="image-placeholder flex h-full w-full items-end p-6 md:p-8">
          <div className="max-w-xs rounded-2xl border border-mist bg-ivory/90 p-5 text-ink/72 backdrop-blur">
            <div className="mb-4 text-gold">
              <svg
                aria-hidden="true"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
            </div>
            <p className="text-sm leading-6">
              Визуал получения доступа к образовательной программе
            </p>
          </div>
        </div>
      ) : (
        <>
          <Image
            alt="Получение доступа к образовательной программе"
            className="object-cover object-top"
            fill
            onError={() => setImageFailed(true)}
            sizes="(min-width: 1024px) 40vw, 100vw"
            src={siteImages.access}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/10 via-transparent to-gold/10" />
        </>
      )}
    </div>
  );
}

export function AccessRequestForm() {
  const packageOptions = professions.flatMap((profession) =>
    profession.packages.map((item) => ({
      value: `${profession.slug}:${item.slug}`,
      label: `${profession.title} — ${packageTitles[item.slug] ?? item.title}`,
    })),
  );
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(
    packageOptions[0]?.value ?? "",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accepted) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <section className="section-space bg-ivory/55" id="access-form">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="min-w-0">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            ДОСТУП
          </p>
          <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            Получение доступа к образовательной программе
          </h2>
          <p className="mt-6 text-base leading-8 text-ink/68">
            На первом этапе личный кабинет не создается. После оплаты доступ к
            материалам приходит на указанный email в виде защищенной ссылки.
            Электронный сертификат отправляется после завершения программы.
          </p>
          <AccessVisual />
        </div>

        <form
          className="min-w-0 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-8"
          onSubmit={handleSubmit}
        >
          <div className="mb-7 rounded-2xl border border-gold/30 bg-porcelain p-5 text-sm leading-7 text-ink/72">
            <p className="font-semibold text-ink">
              После оплаты доступ к материалам придет на указанный email в виде
              защищенной ссылки.
            </p>
            <p className="mt-2">
              Проверьте правильность email перед оплатой: письмо с доступом
              будет отправлено именно на этот адрес. Личный кабинет на первом
              этапе не создается.
            </p>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-semibold text-ink" htmlFor="package">
              Пакет профессии
              <select
                className="h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-white px-4 text-base font-normal text-ink outline-none transition hover:border-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
                id="package"
                name="package"
                onChange={(event) => setSelectedPackage(event.target.value)}
                value={selectedPackage}
              >
                {packageOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink" htmlFor="name">
              Имя
              <input
                className="h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-white px-4 text-base font-normal text-ink outline-none transition placeholder:text-ink/38 hover:border-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
                id="name"
                name="name"
                placeholder="Как к вам обращаться"
                type="text"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink" htmlFor="email">
              Email для доступа
              <input
                className="h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-white px-4 text-base font-normal text-ink outline-none transition placeholder:text-ink/38 hover:border-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
                id="email"
                name="email"
                placeholder="name@example.com"
                required
                type="email"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink" htmlFor="phone">
              Телефон
              <input
                className="h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-white px-4 text-base font-normal text-ink outline-none transition placeholder:text-ink/38 hover:border-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
                id="phone"
                name="phone"
                placeholder="+7"
                type="tel"
              />
            </label>
          </div>

          <label
            className="mt-6 flex cursor-pointer gap-4 rounded-2xl border border-ink/12 bg-porcelain p-4 text-sm leading-6 text-ink"
            htmlFor="personal-data-consent"
          >
            <input
              checked={accepted}
              className="mt-1 h-5 w-5 shrink-0 accent-ink"
              id="personal-data-consent"
              onChange={(event) => {
                setAccepted(event.target.checked);
                setSubmitted(false);
              }}
              required
              type="checkbox"
            />
            <span className="min-w-0">
              Я согласен(на) на{" "}
              <a className="font-semibold text-ink underline decoration-gold underline-offset-4" href="/privacy">
                обработку персональных данных
              </a>{" "}
              и принимаю условия{" "}
              <a className="font-semibold text-ink underline decoration-gold underline-offset-4" href="/offer">
                публичной оферты
              </a>
              .
            </span>
          </label>

          <button
            className="mt-6 w-full rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:bg-evergreen active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-ink/35 disabled:text-white/80"
            disabled={!accepted}
            type="submit"
          >
            Перейти к оплате
          </button>

          {submitted ? (
            <p className="mt-4 rounded-2xl border border-evergreen/20 bg-evergreen/10 p-4 text-sm leading-6 text-evergreen">
              Согласие принято. На следующем этапе будет оплата, а после
              успешной оплаты система подготовит письмо с защищенной ссылкой на
              материалы образовательной программы.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
