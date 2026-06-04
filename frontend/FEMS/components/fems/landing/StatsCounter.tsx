'use client';

import { useEffect, useRef, useState } from 'react';
import { landingStats } from '@/data/landing/stats';

function parseStatValue(value: string): number {
  const digits = value.replace(/\D/g, '');
  return parseInt(digits, 10) || 0;
}

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: string;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const target = parseStatValue(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setDisplay(Math.floor(target * progress));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-4 py-4">
      <p className="text-4xl md:text-5xl font-extrabold text-white">
        {display}
        {suffix && <span className="text-primary-500">{suffix}</span>}
      </p>
      <p className="mt-2 text-sm text-secondary-400">{label}</p>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section id="stats" className="bg-secondary-900 py-20">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
        {landingStats.map((stat, index) => (
          <div
            key={stat.label}
            className={
              index < landingStats.length - 1
                ? 'lg:border-r lg:border-secondary-700'
                : ''
            }
          >
            <AnimatedStat
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
