import { Flame } from 'lucide-react';
import Link from 'next/link';

interface FemsLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function FemsLogo({
  className = '',
  showText = true,
  textClassName = 'text-secondary-900 dark:text-white',
}: FemsLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
        <Flame className="h-5 w-5 text-primary-500" aria-hidden />
      </span>
      {showText && (
        <span className={`text-lg font-bold tracking-tight ${textClassName}`}>
          TZW FEMS
        </span>
      )}
    </Link>
  );
}
