import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { HeroDiagonalAccent } from './shared/HeroDiagonalAccent';

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden flex flex-col"
    >
      <Image
        src="/assets/landing-bg.jpg"
        alt="Fire safety professional at work"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-secondary-900/70 dark:bg-secondary-900/85" />
      <HeroDiagonalAccent />

      <div className="relative z-10 mx-auto flex flex-1 w-full max-w-[1200px] items-center px-6 pt-[72px] pb-8">
        <div className="max-w-[600px]">
          <p className="border-l-4 border-primary-500 pl-3 text-primary-500 text-xs font-semibold tracking-widest uppercase">
            Fire Safety Management
          </p>
          <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
            We Protect What Matters Most.
          </h1>
          <p className="mt-4 text-lg text-secondary-300 max-w-lg leading-relaxed">
            TZW FEMS — End-to-end fire extinguisher management, inspections,
            compliance, and real-time notifications across all your facilities.
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
      </div>

      <a
        href="#services"
        className="relative z-10 mx-auto mb-8 text-white/80 hover:text-white animate-bounce"
        aria-label="Scroll to services"
      >
        <ChevronDown className="h-8 w-8" />
      </a>
    </section>
  );
}
