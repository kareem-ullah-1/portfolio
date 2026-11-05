export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  className = '',
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight [text-shadow:0_2px_20px_rgb(0_0_0/0.5)] sm:text-6xl" data-reveal>
        {title} {accent && <em className="text-gradient pr-1">{accent}</em>}
      </h2>
      {description && (
        <p className="mt-5 text-lg text-muted [text-shadow:0_1px_14px_rgb(0_0_0/0.55)]" data-reveal>
          {description}
        </p>
      )}
    </div>
  );
}
