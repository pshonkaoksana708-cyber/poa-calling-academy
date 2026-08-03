import Image from "next/image";
import { navigation } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-porcelain/88 backdrop-blur-xl">
      <div className="container-shell flex h-20 min-w-0 items-center justify-between gap-4 md:gap-8">
        <a className="shrink-0" href="/">
          <Image
            alt="Академия профессионального развития"
            className="h-[46px] w-auto md:h-[54px] lg:h-[60px]"
            height={1400}
            priority
            src="/images/logo/poa-calling-logo.svg"
            width={1200}
          />
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/72 lg:flex">
          {navigation.map((item) => (
            <a className="premium-nav-link" href={item.href} key={item.href}>
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
