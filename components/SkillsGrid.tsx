type SkillsGridProps = {
  title?: string;
  skills: string[];
};

export function SkillsGrid({ title, skills }: SkillsGridProps) {
  return (
    <div>
      {title ? (
        <h3 className="mb-6 font-serif text-3xl leading-tight text-ink">
          {title}
        </h3>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <div
            className="rounded-2xl border border-ink/10 bg-ivory p-4 text-sm leading-6 text-ink/72"
            key={skill}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}
