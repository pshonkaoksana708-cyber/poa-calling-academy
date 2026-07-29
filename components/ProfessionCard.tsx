import { EditorialImage } from "@/components/EditorialImage";
import { fallbackImages } from "@/data/images";
import { cn } from "@/lib/utils";

type ProfessionCardProps = {
  title: string;
  direction: string;
  description: string;
  href: string;
  imageSrc?: string;
  icon?: "briefcase" | "users" | "map" | "spark";
  status?: string;
  ctaLabel?: string;
  className?: string;
  priority?: boolean;
};

export function ProfessionCard({
  title,
  direction,
  description,
  href,
  imageSrc,
  icon = "briefcase",
  status,
  ctaLabel = "Перейти к программе",
  className,
  priority = false,
}: ProfessionCardProps) {
  return (
    <article
      className={cn(
        "group min-w-0 overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/60",
        className,
      )}
    >
      <EditorialImage
        alt={title}
        aspect="wide"
        className="rounded-none border-0 shadow-none"
        icon={icon}
        label={`Визуал направления “${direction}”`}
        priority={priority}
        src={imageSrc ?? fallbackImages.profession}
      />
      <div className="min-w-0 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="min-w-0 text-xs font-bold uppercase tracking-[0.22em] text-gold [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal]">
            Профессия / {direction}
          </p>
          {status ? (
            <span className="rounded-full border border-gold/30 px-3 py-1 text-xs font-semibold text-ink/62">
              {status}
            </span>
          ) : null}
        </div>
        <h3 className="mt-5 max-w-full font-serif text-[1.375rem] leading-[1.12] text-ink [hyphens:auto] [overflow-wrap:anywhere] [word-break:normal] md:text-[1.625rem] xl:text-[1.875rem] xl:leading-[1.1]">
          {title}
        </h3>
        <p className="mt-4 leading-7 text-ink/68">{description}</p>
        <a
          className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition group-hover:bg-evergreen"
          href={href}
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}
