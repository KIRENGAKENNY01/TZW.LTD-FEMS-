'use client';

import { useState } from 'react';
import { contactInfo } from '@/data/landing/contact';
import { SectionHeader } from './shared/SectionHeader';

const inputClassName =
  'h-12 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm text-secondary-900 dark:text-secondary-50 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-secondary-50 dark:bg-secondary-900 py-24">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <SectionHeader
            eyebrow="Get In Touch"
            title="Services That Help Our Clients Meet Compliance"
            subtitle="Request a demo and our team will reach out within one business day."
            centered={false}
          />

          {submitted ? (
            <div className="rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-6">
              <p className="text-sm text-primary-700 dark:text-primary-400">
                Thank you! Your demo request has been received. We will contact you
                shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 -mt-4">
              <input
                type="text"
                name="fullName"
                required
                placeholder="Full Name"
                className={inputClassName}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                className={inputClassName}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className={inputClassName}
              />
              <input
                type="text"
                name="facility"
                placeholder="Building / Facility"
                className={inputClassName}
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Message"
                className={`${inputClassName} h-auto py-3 resize-none`}
              />
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200"
              >
                Request a Demo
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-secondary-900 dark:bg-secondary-950 rounded-2xl p-8 h-full">
            <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
            <ul className="space-y-5">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="flex gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-secondary-500 uppercase tracking-wide">
                        {item.label}
                      </p>
                      <p className="text-sm text-secondary-300 mt-0.5">{item.value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
