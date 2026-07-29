import Image from "next/image";
import { publicAssetExists } from "@/lib/assets";

type EditorialImageProps = {
  src: string;
  alt: string;
  label: string;
  aspect?: "portrait" | "wide";
  icon?: "briefcase" | "users" | "map" | "spark";
  className?: string;
  objectPosition?: string;
  priority?: boolean;
  sizes?: string;
};

function LineIcon({ icon = "briefcase" }: { icon?: EditorialImageProps["icon"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  if (icon === "users") {
    return (
      <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 24 24">
        <path {...common} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path {...common} d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path {...common} d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path {...common} d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (icon === "map") {
    return (
      <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 24 24">
        <path {...common} d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path {...common} d="M9 3v15" />
        <path {...common} d="M15 6v15" />
      </svg>
    );
  }

  if (icon === "spark") {
    return (
      <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 24 24">
        <path {...common} d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path {...common} d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 24 24">
      <path {...common} d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <path {...common} d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path {...common} d="M3 13h18" />
      <path {...common} d="M10 13v2h4v-2" />
    </svg>
  );
}

export function EditorialImage({
  src,
  alt,
  label,
  aspect = "portrait",
  icon,
  className = "",
  objectPosition,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: EditorialImageProps) {
  const exists = publicAssetExists(src);
  const aspectClass = aspect === "wide" ? "aspect-[16/10]" : "aspect-[4/5]";

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-mist bg-ivory shadow-soft ${aspectClass} ${className}`}
    >
      {exists ? (
        <>
        <Image
          alt={alt}
          className="object-cover object-top"
          fill
          priority={priority}
          sizes={sizes}
          src={src}
          style={objectPosition ? { objectPosition } : undefined}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/10 via-transparent to-gold/10" />
        </>
      ) : (
        <div className="image-placeholder flex h-full w-full items-end p-6 md:p-8">
          <div className="max-w-xs rounded-2xl border border-mist bg-ivory/90 p-5 text-ink/72 backdrop-blur">
            <div className="mb-4 text-gold">
              <LineIcon icon={icon} />
            </div>
            <p className="text-sm leading-6">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
