import type { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { unlocked, title, description, category } = achievement;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
        unlocked
          ? 'border-lumen-teal/35 bg-lumen-surface shadow-[0_4px_24px_rgba(20,184,166,0.12)] ring-1 ring-lumen-teal/10'
          : 'border-lumen-silver-light bg-lumen-bg/60'
      }`}
    >
      {unlocked && (
        <>
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-lumen-teal/10 blur-2xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-lumen-teal/15 to-transparent" />
        </>
      )}

      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
              unlocked
                ? 'border-lumen-teal/40 bg-lumen-teal-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]'
                : 'border-lumen-silver-light bg-lumen-silver-light/40'
            }`}
          >
            <div
              className={`h-3.5 w-3.5 rotate-45 rounded-sm ${
                unlocked ? 'bg-lumen-teal shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'bg-lumen-silver'
              }`}
            />
          </div>

          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
              unlocked
                ? 'bg-lumen-teal-soft text-lumen-teal'
                : 'bg-lumen-silver-light text-lumen-silver'
            }`}
          >
            {unlocked ? 'Получено' : 'Не открыто'}
          </span>
        </div>

        <div>
          <p className="text-xs text-lumen-silver">{category}</p>
          <h3
            className={`mt-1 font-semibold ${
              unlocked ? 'text-lumen-graphite' : 'text-lumen-graphite-light'
            }`}
          >
            {title}
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-lumen-graphite-light">{description}</p>
      </div>
    </article>
  );
}
