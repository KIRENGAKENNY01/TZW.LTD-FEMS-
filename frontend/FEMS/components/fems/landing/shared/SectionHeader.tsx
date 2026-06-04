interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  withBorder?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  withBorder = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-12 max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}
    >
      <p
        className={`text-primary-500 text-xs font-semibold tracking-widest uppercase ${
          withBorder ? 'border-l-4 border-primary-500 pl-3' : ''
        } ${centered && !withBorder ? '' : ''}`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-secondary-500 dark:text-secondary-400 text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
