'use client';

import Image from 'next/image';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { FemsLogo } from '@/components/fems/landing/shared/FemsLogo';
import { HeroDiagonalAccent } from '@/components/fems/landing/shared/HeroDiagonalAccent';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden md:flex md:w-1/2 min-h-screen flex-col items-center justify-center overflow-hidden">
        <Image
          src="/assets/auth-bg.jpg"
          alt="Firefighter profile"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-secondary-900/65" />
        <HeroDiagonalAccent className="opacity-60 w-1/3" />
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 shadow-lg mb-6">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm1 14h-2v-1h2v1zm0-3h-2v-1h2v1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TZW FEMS</h1>
          <p className="mt-2 text-sm text-secondary-300">Protecting what matters most</p>
        </div>
      </div>

      <div className="relative flex w-full md:w-1/2 min-h-screen flex-col bg-white dark:bg-secondary-900">
        <div className="absolute top-6 right-6 z-10">
          <ThemeSwitch />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="mb-8 md:hidden">
            <FemsLogo />
          </div>
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
