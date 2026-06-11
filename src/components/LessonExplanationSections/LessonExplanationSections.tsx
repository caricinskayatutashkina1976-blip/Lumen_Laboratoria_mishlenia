import type { LessonExplanation } from '../../types';

interface LessonExplanationSectionsProps {
  explanation: LessonExplanation;
}

const sections: {
  key: keyof LessonExplanation;
  label: string;
  accent: string;
}[] = [
  { key: 'shortExplanation', label: 'Коротко', accent: 'border-lumen-teal' },
  { key: 'lifeExample', label: 'Пример из жизни', accent: 'border-lumen-blue' },
  { key: 'miniExample', label: 'Мини-пример', accent: 'border-lumen-graphite/30' },
  { key: 'commonMistakes', label: 'Где чаще всего ошибаются', accent: 'border-lumen-blue/40' },
  { key: 'howToRemember', label: 'Как запомнить', accent: 'border-lumen-teal/60' },
];

export function LessonExplanationSections({ explanation }: LessonExplanationSectionsProps) {
  return (
    <div className="space-y-4">
      {sections.map(({ key, label, accent }) => (
        <article
          key={key}
          className={`lumen-card border-l-4 ${accent} p-5 sm:p-6`}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-lumen-graphite">
            {label}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
            {explanation[key] as string}
          </p>
        </article>
      ))}

      <article className="lumen-card border-l-4 border-lumen-teal p-5 sm:p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-lumen-graphite">
          Проверь себя
        </h3>
        <ul className="mt-4 space-y-3">
          {explanation.selfCheck.map((question, index) => (
            <li key={index} className="flex gap-3 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lumen-teal-soft text-xs font-semibold text-lumen-teal">
                ?
              </span>
              {question}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
