export function HeroDiagonalAccent({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute right-0 top-0 h-full w-1/2 md:w-2/5 opacity-80 ${className}`}
      viewBox="0 0 400 800"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polygon fill="#EF4444" points="120,0 400,0 400,800 0,800" />
    </svg>
  );
}
