export function Footer() {
  return (
    <footer className="border-t hairline py-12">
      <div className="container-shell flex flex-col justify-between gap-8 md:flex-row md:items-start">
        <div>
          <p className="font-serif text-2xl">POA CALLING</p>
          <p className="mt-2 text-sm text-ink/60">
            Академия профессионального развития. Практическое образование,
            которое открывает новые профессиональные возможности.
          </p>
        </div>
        <div className="grid gap-5 text-sm text-ink/68 md:max-w-2xl md:grid-cols-[1fr_0.9fr]">
          <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Юридическая навигация">
            <a href="mailto:oksana.pshonka@mail.ru">Контакты</a>
            <a href="/offer">Публичная оферта</a>
            <a href="/privacy">Политика обработки персональных данных</a>
            <a href="/terms">Пользовательское соглашение</a>
            <a href="#catalog">Программы</a>
            <a href="#faq">Вопросы</a>
          </nav>
          <div className="space-y-1 text-ink/60">
            <p className="font-semibold text-ink/70">Пшонка Оксана Михайловна</p>
            <p>Самозанятая, НПД</p>
            <p>ИНН 550413053553</p>
            <a className="inline-block" href="mailto:oksana.pshonka@mail.ru">
              oksana.pshonka@mail.ru
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
