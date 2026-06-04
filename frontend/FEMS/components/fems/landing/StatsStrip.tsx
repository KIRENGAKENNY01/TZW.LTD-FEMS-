import { landingStats } from '@/data/landing/stats';

export function StatsStrip() {
  return (
    <div className="bg-secondary-800 py-6">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-6 lg:grid-cols-4 lg:gap-0">
        {landingStats.map((stat, index) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center text-center px-4 ${
              index < landingStats.length - 1
                ? 'lg:border-r lg:border-secondary-700'
                : ''
            }`}
          >
            <p className="text-3xl font-bold text-white">
              {stat.value}
              {stat.suffix && (
                <span className="text-primary-500">{stat.suffix}</span>
              )}
            </p>
            <p className="mt-1 text-sm text-secondary-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
