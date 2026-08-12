import { supportEmail } from "@/data/config/email";
import { validateAccessTokenForPrograms } from "@/lib/course-access";
import {
  appendToken,
  getSupplyAccessibleBlockCount,
  supplyBlock1AccessKeys,
} from "@/app/course/supply/basic/access";

export function getSupplyTokenAccess(token?: string) {
  const access = validateAccessTokenForPrograms(token, supplyBlock1AccessKeys);

  if (!access.ok) {
    return {
      ok: false as const,
      blockCount: 0,
    };
  }

  return {
    ok: true as const,
    blockCount: getSupplyAccessibleBlockCount(access.payload),
  };
}

export function PackageAccessDenied({
  token,
}: {
  token?: string;
}) {
  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <div className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Защищенный доступ
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
            Этот уровень не входит в приобретённый пакет
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            Откройте доступную часть программы по защищенной ссылке из письма.
            Материалы блоков выше оплаченного пакета не раскрываются.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href={appendToken("/course/supply/basic", token)}
            >
              Вернуться к программе
            </a>
            <a
              className="rounded-full border border-ink/15 px-7 py-4 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-evergreen"
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
