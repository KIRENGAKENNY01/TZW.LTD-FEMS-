import Image from 'next/image';
import { landingServices } from '@/data/landing/services';
import { SectionHeader } from './shared/SectionHeader';

export function ServicesSection() {
  return (
    <section id="services" className="bg-secondary-50 dark:bg-secondary-900 py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="What We Do"
          title="We Offer Fire Safety Management Services"
          subtitle="Comprehensive extinguisher lifecycle management for commercial and industrial facilities."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {landingServices.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className="group bg-white dark:bg-secondary-800 rounded-xl overflow-hidden shadow-card border border-secondary-200 dark:border-secondary-700 hover:-translate-y-1 hover:shadow-elevated transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div
                    className="absolute bottom-0 right-0 h-full w-1/3 bg-primary-500 opacity-90"
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                    aria-hidden
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-500">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
