import type { Grade } from '../../types';
import { GRADE_VIEW_OPTIONS } from '../../data/grades';

interface GradeSwitcherProps {
  value: Grade;
  onChange: (grade: Grade) => void;
  className?: string;
  label?: string;
}

export function GradeSwitcher({
  value,
  onChange,
  className = '',
  label = 'Что изучаем?',
}: GradeSwitcherProps) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {GRADE_VIEW_OPTIONS.map((option) => (
          <button
            key={String(option.id)}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              value === option.id
                ? 'border-lumen-blue bg-lumen-blue-soft text-lumen-blue'
                : 'border-lumen-silver-light bg-lumen-bg text-lumen-graphite-light hover:border-lumen-teal/40'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
