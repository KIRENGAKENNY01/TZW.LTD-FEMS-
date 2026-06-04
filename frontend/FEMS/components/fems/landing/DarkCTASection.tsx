import Image from 'next/image';
import Link from 'next/link';

export function DarkCTASection() {
  return (
    <section className="bg-secondary-900 py-20">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            We Offer Cost Efficient Fire Safety Services
          </h2>
          <p className="mt-4 text-secondary-400 text-base leading-relaxed">
            Reduce manual paperwork, eliminate missed inspections, and keep
            regulators satisfied with a platform built for operational teams.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white px-7 py-3 text-sm font-semibold transition-all duration-200"
            >
              Get Started
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-md border-2 border-white text-white hover:bg-white hover:text-secondary-900 px-7 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl relative aspect-video">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80"
            alt="Industrial facility fire safety"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
