import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';
import { teamMembers } from '@/data/landing/team';
import { SectionHeader } from './shared/SectionHeader';

export function TeamSection() {
  return (
    <section id="team" className="bg-white dark:bg-secondary-900 py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Our Team"
          title="Meet the Inspectors Behind FEMS"
          subtitle="Role-based access for administrators, field inspectors, and facility users."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="rounded-xl border border-secondary-200 dark:border-secondary-700 p-4 hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 bg-white dark:bg-secondary-800"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-primary-500 text-sm mt-0.5">{member.role}</p>
              <div className="mt-3 flex gap-3">
                {member.linkedIn && (
                  <Link
                    href={member.linkedIn}
                    className="text-secondary-400 hover:text-primary-500 transition-colors"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-secondary-400 hover:text-primary-500 transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
