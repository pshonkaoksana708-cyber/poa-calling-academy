import { supportEmail } from "@/data/config/email";
import { getAllowedAccessKeysForLevel } from "@/data/professions";
import {
  getAccessibleBlockCount,
  getEntitledBlockCount,
  validateAccessTokenForPrograms,
  type AccessValidationResult,
} from "@/lib/course-access";

const levelSlugByBlock = {
  1: "basic",
  2: "practice",
  3: "pro",
} as const;

export function appendToken(href: string, token?: string) {
  if (!token) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}token=${encodeURIComponent(token)}`;
}

export function validateCourseBlockAccess(
  professionSlug: string,
  token: string | undefined,
  blockNumber: 1 | 2 | 3,
) {
  return validateAccessTokenForPrograms(
    token,
    getAllowedAccessKeysForLevel(professionSlug, levelSlugByBlock[blockNumber]),
    { requiredBlock: blockNumber },
  );
}

export function getCourseTokenAccess(
  professionSlug: string,
  token?: string,
) {
  const allowedKeys = ([1, 2, 3] as const).flatMap((blockNumber) =>
    getAllowedAccessKeysForLevel(
      professionSlug,
      levelSlugByBlock[blockNumber],
    ),
  );
  const access = validateAccessTokenForPrograms(token, [...new Set(allowedKeys)]);

  if (!access.ok) {
    return { ok: false as const, blockCount: 0, validation: access };
  }

  return {
    ok: true as const,
    blockCount: getAccessibleBlockCount(access.payload),
    entitledBlockCount: getEntitledBlockCount(access.payload),
    payload: access.payload,
    validation: access,
  };
}

export function getCompletedCourseAccess(
  professionSlug: string,
  token?: string,
) {
  const tokenAccess = getCourseTokenAccess(professionSlug, token);

  if (!tokenAccess.ok) {
    return { ok: false as const, validation: tokenAccess.validation };
  }

  const requiredBlock = tokenAccess.entitledBlockCount as 1 | 2 | 3;
  const validation = validateCourseBlockAccess(
    professionSlug,
    token,
    requiredBlock,
  );

  if (!validation.ok) {
    return { ok: false as const, validation };
  }

  return {
    ok: true as const,
    packageSlug:
      requiredBlock === 1
        ? ("basic" as const)
        : requiredBlock === 2
          ? ("practice" as const)
          : ("professional" as const),
  };
}

function formatUnlockDate(unlockAt: number) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long",
    timeZone: "Europe/Moscow",
  }).format(new Date(unlockAt * 1000));
}

export function PackageAccessDenied({
  professionSlug,
  token,
  validation,
}: {
  professionSlug: string;
  token?: string;
  validation?: AccessValidationResult;
}) {
  const isTimeLocked =
    validation?.ok === false &&
    validation.reason === "not_yet_available" &&
    validation.unlockAt;
  const isWrongPackage =
    validation?.ok === false && validation.reason === "wrong_program";
  const title = isTimeLocked
    ? "Блок пока закрыт"
    : isWrongPackage
      ? "Этот материал не входит в приобретённый пакет"
      : "Нет доступа к материалу";
  const description = isTimeLocked
    ? `Блок откроется автоматически ${formatUnlockDate(
        validation.unlockAt!,
      )}. Дата рассчитана от момента подтверждённой оплаты.`
    : isWrongPackage
      ? "Откройте доступную часть программы по защищенной ссылке из письма. Материалы выше оплаченного пакета не раскрываются."
      : "Материал доступен только по действительной защищенной ссылке из письма после оплаты.";

  return (
    <main className="min-h-screen bg-porcelain py-16 md:py-24">
      <section className="container-shell">
        <div className="rounded-3xl border border-ink/10 bg-ivory p-6 shadow-soft md:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-gold">
            Защищенный доступ
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded-full bg-ink px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-evergreen"
              href={appendToken(`/course/${professionSlug}/basic`, token)}
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
