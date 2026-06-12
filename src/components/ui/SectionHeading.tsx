type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
};

export function SectionHeading({ title, subtitle, centered, className = "" }: SectionHeadingProps) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <h2 className="text-2xl font-bold text-eat-ink md:text-3xl">{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-eat-muted max-w-2xl ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
