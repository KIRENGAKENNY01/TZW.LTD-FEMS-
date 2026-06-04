import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Sign In — TZW FEMS',
    template: '%s | TZW FEMS',
  },
};

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
