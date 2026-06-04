'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/data/landing/nav';
import { FemsLogo } from './shared/FemsLogo';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full h-[60px] md:h-[72px] transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : ''
      } bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md border-b border-secondary-200/80 dark:border-secondary-700/80`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        <FemsLogo />

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-secondary-600 hover:text-primary-500 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitch />
          <Link
            href="#contact"
            className="rounded-md bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white px-5 py-2 text-sm font-semibold transition-all duration-200"
          >
            Book a Demo
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <ThemeSwitch />
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
            className="text-secondary-700 dark:text-secondary-200"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-secondary-600 hover:text-primary-500 dark:text-secondary-400 py-2"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center rounded-md bg-primary-500 hover:bg-primary-600 text-white px-5 py-3 text-sm font-semibold transition-all"
          >
            Book a Demo
          </Link>
        </div>
      )}
    </header>
  );
}
