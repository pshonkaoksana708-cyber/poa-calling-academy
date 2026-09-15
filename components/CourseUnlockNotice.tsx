export function CourseUnlockNotice({ unlockAt }: { unlockAt?: number }) {
  if (!unlockAt) {
    return null;
  }

  const date = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long",
    timeZone: "Europe/Moscow",
  }).format(new Date(unlockAt * 1000));

  return (
    <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-5 text-base leading-8 text-ink/75">
      <p className="font-semibold text-ink">Блок пока закрыт по времени.</p>
      <p className="mt-2">
        Он откроется автоматически {date}. Дата рассчитана от момента
        подтверждённой оплаты.
      </p>
    </div>
  );
}
