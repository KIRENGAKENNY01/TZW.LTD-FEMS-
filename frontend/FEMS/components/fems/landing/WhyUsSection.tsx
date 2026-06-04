import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { whyUsFeatures } from '@/data/landing/features';

export function WhyUsSection() {
  return (
    <section className="bg-secondary-50 dark:bg-secondary-800/40 py-24">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white">
            Fire Safety Is Often Overlooked — Until It&apos;s Too Late.
          </h2>
          <p className="mt-4 text-secondary-600 dark:text-secondary-400 text-base leading-relaxed">
            FEMS gives facility managers a single source of truth for every
            extinguisher, inspection, and maintenance event — with proactive
            alerts before deadlines are missed.
          </p>
          <ul className="mt-8 space-y-3">
            {whyUsFeatures.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="h-5 w-5 flex-shrink-0 text-primary-500 mt-0.5"
                  aria-hidden
                />
                <span className="text-secondary-700 dark:text-secondary-300 text-sm">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white px-7 py-3 text-sm font-semibold transition-all duration-200"
          >
            Start Managing
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-hero relative aspect-[4/3]">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80"
            alt="FEMS compliance dashboard"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
