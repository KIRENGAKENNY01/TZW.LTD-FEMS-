import { Inter } from 'next/font/google';
import { siteConfig } from '@/data/config/site.settings';
import { ThemeProviders } from './theme-providers';
import { Metadata } from 'next';
import { AuthProvider } from '@/lib/context/AuthContext';

import '@/css/globals.css';
import { AnalyticsWrapper } from '@/components/shared/Analytics';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-default',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'TZW FEMS — Fire Extinguisher Management System',
    template: `%s | TZW FEMS`,
  },
  description:
    'TZW LTD Fire Extinguisher Management System — manage inspections, maintenance, compliance and notifications across all facilities.',
  openGraph: {
    title: 'TZW FEMS',
    description: 'Fire Extinguisher Management System by TZW LTD',
    url: './',
    siteName: 'TZW FEMS',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-secondary-50 text-secondary-900 antialiased dark:bg-secondary-900 dark:text-secondary-50 min-h-screen font-sans">
        <ThemeProviders>
          <AnalyticsWrapper />
          <AuthProvider>{children}</AuthProvider>
        </ThemeProviders>
      </body>
    </html>
  );
}
