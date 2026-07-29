import { navigation } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-porcelain/88 backdrop-blur-xl">
      <div className="container-shell flex h-20 min-w-0 items-center justify-between gap-4 md:gap-8">
        <a className="min-w-0 max-w-[220px] font-serif text-sm leading-[1.1] text-ink [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal] sm:max-w-[260px] sm:text-base lg:max-w-[340px] lg:text-xl" href="#">
          POA CALLING
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/72 lg:flex">
          {navigation.map((item) => (
            <a className="transition hover:text-ink" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="hidden rounded-full border border-gold/60 px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold hover:text-ink xl:inline-flex"
          href="#catalog"
        >
          Выбрать программу
        </a>
      </div>
    </header>
  );
}
