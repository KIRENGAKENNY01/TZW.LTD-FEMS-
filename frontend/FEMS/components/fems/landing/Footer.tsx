import Link from 'next/link';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { FemsLogo } from './shared/FemsLogo';

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
];

const serviceLinks = [
  'Extinguisher Inspection',
  'Maintenance Logging',
  'Compliance Reports',
  'Notifications',
];

export function Footer() {
  return (
    <footer className="bg-secondary-950 py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <FemsLogo textClassName="text-white" />
            <p className="mt-4 text-sm font-medium text-white">
              Protecting What Matters Most.
            </p>
            <p className="mt-2 text-sm text-secondary-500 leading-relaxed">
              TZW LTD Fire Extinguisher Management System for commercial and
              industrial facilities.
            </p>
            <div className="mt-4 flex gap-3">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-secondary-500 hover:text-primary-500 transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-500 hover:text-primary-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <span className="text-sm text-secondary-500">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-secondary-500">
              <li>12 Industrial Park Drive</li>
              <li>Harare, Zimbabwe</li>
              <li className="hover:text-primary-500">
                <a href="tel:+26341234567">+263 4 123 4567</a>
              </li>
              <li className="hover:text-primary-500">
                <a href="mailto:info@tzw.co.zw">info@tzw.co.zw</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-secondary-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-secondary-500 text-sm">
            © {new Date().getFullYear()} TZW LTD. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-secondary-500 text-sm hover:text-primary-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-secondary-500 text-sm hover:text-primary-500 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
