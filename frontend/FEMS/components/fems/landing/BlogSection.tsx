import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/data/landing/blog';
import { SectionHeader } from './shared/SectionHeader';

export function BlogSection() {
  return (
    <section className="bg-white dark:bg-secondary-900 py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Updates"
          title="Latest From TZW FEMS"
          subtitle="Industry insights, compliance tips, and product news."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden hover:shadow-elevated transition-shadow duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-secondary-400">{post.date}</p>
                <span className="mt-2 inline-flex w-fit rounded-md border border-primary-200 bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800">
                  {post.category}
                </span>
                <h3 className="mt-2 text-base font-semibold text-secondary-900 dark:text-white hover:text-primary-500 transition-colors">
                  <Link href={post.href}>{post.title}</Link>
                </h3>
                <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 line-clamp-2 flex-1">
                  {post.excerpt}
                </p>
                <Link
                  href={post.href}
                  className="mt-4 text-primary-500 font-medium text-sm hover:text-primary-600 transition-colors"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
