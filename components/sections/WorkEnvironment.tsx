import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/images";

const environmentImages = [
  {
    alt: "Рабочая среда образовательных программ",
    src: siteImages.officePrimary,
  },
  {
    alt: "Командная коммуникация в профессиональной среде",
    src: siteImages.teamPrimary,
  },
  {
    alt: "Рабочие материалы и документы",
    src: siteImages.officeSecondary,
  },
];

function EnvironmentPhoto({
  alt,
  className = "",
  sizes = "(min-width: 1024px) 52vw, 100vw",
  src,
}: {
  alt: string;
  className?: string;
  sizes?: string;
  src: string;
}) {
  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-mist bg-ivory shadow-soft ${className}`}
    >
      <Image
        alt={alt}
        className="object-cover"
        fill
        sizes={sizes}
        src={src}
      />
    </div>
  );
}

export function WorkEnvironment() {
  return (
    <section className="section-space bg-ivory/55">
      <div className="container-shell">
        <SectionHeading
          eyebrow="СРЕДА"
          title="Командная и рабочая среда"
          description="Образовательные программы показывают не только теорию, но и реальную профессиональную среду: задачи, коммуникации, документы, сроки и ответственность."
        />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <EnvironmentPhoto
            alt={environmentImages[0].alt}
            className="lg:min-h-[440px]"
            src={environmentImages[0].src}
          />
          <div className="grid gap-5">
            {environmentImages.slice(1).map((image) => (
              <EnvironmentPhoto
                alt={image.alt}
                className="shadow-none"
                key={image.src}
                sizes="(min-width: 1024px) 34vw, 100vw"
                src={image.src}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
