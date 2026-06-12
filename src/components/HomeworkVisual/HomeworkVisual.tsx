import type { HomeworkType } from '../../data/homeworkAnalyzer';

interface HomeworkVisualProps {
  type: HomeworkType;
}

const VISUALS: Record<HomeworkType, { labels: string[]; title: string }> = {
  purchases: {
    title: 'Схема покупки',
    labels: ['Цена', 'Количество', 'Всего'],
  },
  motion: {
    title: 'Схема движения',
    labels: ['Скорость', 'Время', 'Расстояние'],
  },
  percent: {
    title: 'Схема процентов',
    labels: ['100%', 'Часть', 'Процент'],
  },
  area: {
    title: 'Схема площади',
    labels: ['Длина', 'Ширина', 'Площадь'],
  },
  text: {
    title: 'Схема текстовой задачи',
    labels: ['Известно', 'Найти', 'Действие'],
  },
};

export function HomeworkVisual({ type }: HomeworkVisualProps) {
  const visual = VISUALS[type];

  return (
    <section className="lumen-card overflow-hidden border-l-4 border-lumen-blue/30 p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
        Покажи наглядно
      </p>
      <h3 className="mt-1 text-base font-semibold text-lumen-graphite">{visual.title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {visual.labels.map((label, index) => (
          <div key={label} className="relative">
            <div
              className={`rounded-xl border px-4 py-5 text-center ${
                index === 0
                  ? 'border-lumen-blue/25 bg-lumen-blue-soft/40'
                  : index === 1
                    ? 'border-lumen-silver-light bg-lumen-bg'
                    : 'border-lumen-teal/25 bg-lumen-teal-soft/40'
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  index === 0
                    ? 'text-lumen-blue'
                    : index === 2
                      ? 'text-lumen-teal'
                      : 'text-lumen-graphite-light'
                }`}
              >
                {label}
              </p>
            </div>
            {index < visual.labels.length - 1 && (
              <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-lg text-lumen-teal sm:block">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
