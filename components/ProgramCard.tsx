import { EditorialImage } from "@/components/EditorialImage";
import { cn } from "@/lib/utils";

type ProgramCardProps = {
  title: string;
  label: string;
  description: string;
  duration?: string;
  price?: string;
  result?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageObjectPosition?: string;
  featured?: boolean;
  compact?: boolean;
  ctaLabel?: string;
  className?: string;
};

export function ProgramCard({
  title,
  label,
  description,
  duration,
  price,
  result,
  href,
  imageSrc,
  imageAlt,
  imageObjectPosition,
  featured = false,
  compact = false,
  ctaLabel = "Выбрать пакет",
  className,
}: ProgramCardProps) {
  const content = (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col justify-between overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-1",
        compact ? "p-5 md:p-6" : "p-7",
        featured
          ? "border-gold/60 bg-ink text-white shadow-soft"
          : "border-ink/10 bg-ivory text-ink hover:border-gold/60 hover:shadow-soft",
        className,
      )}
    >
      {imageSrc ? (
        <EditorialImage
          alt={imageAlt ?? title}
          aspect="wide"
          className={cn(
            "rounded-b-none rounded-t-3xl border-0 shadow-none",
            compact ? "-mx-5 -mt-5 mb-5 md:-mx-6 md:-mt-6" : "-mx-7 -mt-7 mb-7",
          )}
          icon="briefcase"
          label={`Визуал уровня “${title}”`}
          objectPosition={imageObjectPosition}
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
          src={imageSrc}
        />
      ) : null}
      <div className="min-w-0">
        <p className={cn("min-w-0 text-xs font-bold uppercase tracking-[0.22em] [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal]", featured ? "text-gold" : "text-evergreen")}>
          {label}
        </p>
        <h3 className={cn("max-w-full font-serif text-[1.375rem] leading-[1.12] [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal] md:text-[1.625rem] xl:text-[1.875rem] xl:leading-[1.1]", compact ? "mt-4" : "mt-5")}>
          {title}
        </h3>
        <p className={cn("leading-7", compact ? "mt-3" : "mt-4", featured ? "text-white/72" : "text-ink/68")}>
          {description}
        </p>
        {(duration || price) ? (
          <div className={cn("grid border-t text-sm", compact ? "mt-4 gap-2 pt-4" : "mt-6 gap-3 pt-5", featured ? "border-white/12 text-white/70" : "border-ink/10 text-ink/62")}>
            {duration ? <span>{duration}</span> : null}
            {price ? <span>{price}</span> : null}
          </div>
        ) : null}
        {result ? (
          <p className={cn("rounded-2xl border text-sm leading-6", compact ? "mt-4 p-3" : "mt-6 p-4", featured ? "border-gold/30 bg-white/[0.04] text-white/76" : "border-gold/30 bg-porcelain text-ink/70")}>
            {result}
          </p>
        ) : null}
      </div>

      {href ? (
        <span
          className={cn(
            "inline-flex w-fit rounded-full px-6 py-3 text-sm font-bold transition",
            compact ? "mt-5" : "mt-7",
            featured
              ? "bg-gold text-ink hover:bg-white"
              : "bg-ink text-white hover:bg-evergreen",
          )}
        >
          {ctaLabel}
        </span>
      ) : null}
    </article>
  );

  return href ? <a href={href}>{content}</a> : content;
}
