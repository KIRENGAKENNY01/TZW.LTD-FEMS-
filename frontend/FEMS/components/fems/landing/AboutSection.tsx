import Image from 'next/image';
import { ShieldCheck, FileCheck } from 'lucide-react';
import { SectionHeader } from './shared/SectionHeader';

const features = [
  {
    icon: ShieldCheck,
    title: 'Certified Inspectors',
    description: 'Licensed and trained fire safety professionals.',
  },
  {
    icon: FileCheck,
    title: 'Full Compliance Coverage',
    description: 'Inspection reports, maintenance logs, real-time alerts.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-white dark:bg-secondary-900 py-24">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl h-[320px] sm:h-[480px] w-full relative">
            <Image
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
              alt="Fire inspector conducting safety check"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <span className="absolute bottom-6 left-6 bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">
            Certified Safety Experts
          </span>
        </div>

        <div>
          <SectionHeader
            eyebrow="Who We Are"
            title="Providing High Quality Fire Safety Solutions"
            subtitle=""
            centered={false}
          />
          <p className="-mt-8 text-primary-600 dark:text-primary-400 font-medium mb-4">
            TZW LTD delivers enterprise-grade fire extinguisher management for
            multi-site operators who cannot afford compliance gaps.
          </p>
          <p className="text-secondary-600 dark:text-secondary-400 text-base leading-relaxed">
            From initial asset registration through scheduled inspections,
            maintenance logging, and automated expiry notifications — FEMS
            keeps your entire portfolio audit-ready around the clock.
          </p>
          <ul className="mt-8 space-y-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-500">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">
                      {feature.title}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
