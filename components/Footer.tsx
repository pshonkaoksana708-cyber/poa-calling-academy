export function Footer() {
  return (
    <footer className="border-t hairline py-12">
      <div className="container-shell flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="font-serif text-2xl">POA CALLING</p>
          <p className="mt-2 text-sm text-ink/60">
            Академия профессионального развития. Практическое образование,
            которое открывает новые профессиональные возможности.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-ink/68">
          <a href="mailto:info@cpr.education">Контакты</a>
          <a href="/privacy">Политика обработки персональных данных</a>
          <a href="/offer">Публичная оферта</a>
          <a href="/terms">Пользовательское соглашение</a>
          <a href="#catalog">Программы</a>
          <a href="#faq">Вопросы</a>
        </div>
      </div>
    </footer>
  );
}
