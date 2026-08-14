import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Оплата не завершена",
  description:
    "Страница отмененной или неуспешной оплаты образовательной программы POA CALLING.",
  robots: noIndexRobots,
};

export default function PaymentFailPage() {
  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Оплата
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
            Оплата не завершена
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/72 md:text-lg">
            Платёж был отменён или не прошёл. Вы можете вернуться к выбору
            программы и повторить оплату позднее.
          </p>

          <div className="mt-10 rounded-3xl border border-gold/30 bg-porcelain p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
              Что можно сделать
            </p>
            <p className="mt-4 leading-7 text-ink/70">
              Проверьте данные карты, доступность выбранного способа оплаты или
              выберите программу заново. Доступ к материалам отправляется только
              после подтверждения платежа платежной системой.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-evergreen"
              href="/#catalog"
            >
              Выбрать программу
            </a>
            <a
              className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-bold text-ink transition hover:border-gold hover:text-evergreen"
              href="/"
            >
              Вернуться на главную
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
