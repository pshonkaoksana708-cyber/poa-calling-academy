import type { Metadata } from "next";
import {
  accessEmailTemplate,
  paymentSuccessCopy,
  supportEmail,
} from "@/data/config/email";

export const metadata: Metadata = {
  title: "Оплата прошла успешно",
  description:
    "Страница подтверждения оплаты образовательной программы Академии профессионального развития.",
};

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Payment complete
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
            {paymentSuccessCopy.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/72 md:text-lg">
            {paymentSuccessCopy.text}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink/72 md:text-lg">
            {paymentSuccessCopy.note}
          </p>

          <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[2rem] border border-mist bg-ivory">
            <img
              src="/images/author/author-15.webp"
              alt="Автор"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div className="mt-10 rounded-3xl border border-gold/30 bg-porcelain p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
              Email-доставка доступа
            </p>
            <h2 className="mt-4 font-serif text-3xl text-ink">
              {accessEmailTemplate.subject}
            </h2>
            <p className="mt-4 leading-7 text-ink/70">
              Письмо будет содержать название выбранной образовательной
              программы и защищенную ссылку для открытия материалов.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-evergreen"
              href="/#catalog"
            >
              К каталогу программ
            </a>
            <a
              className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-bold text-ink transition hover:border-gold hover:text-evergreen"
              href={`mailto:${supportEmail}`}
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
