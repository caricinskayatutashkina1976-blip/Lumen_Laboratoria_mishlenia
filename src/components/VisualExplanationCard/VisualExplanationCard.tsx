import type { ReactNode } from 'react';

interface VisualExplanationCardProps {
  topicId?: string;
  visualType?: string;
  className?: string;
}

const VISUAL_TYPE_ALIASES: Record<string, string> = {
  'text-problems': 'wordProblem',
  wordProblem: 'wordProblem',
  fractions: 'fractions',
  percents: 'percent',
  percent: 'percent',
  motion: 'movement',
  movement: 'movement',
  'area-perimeter': 'area',
  area: 'area',
  equations: 'equation',
  equation: 'equation',
  parts: 'parts',
  divisibility: 'divisibility',
  units: 'measurement',
  measurement: 'measurement',
  comparison: 'comparison',
  'natural-numbers': 'numberLine',
  numberLine: 'numberLine',
  'order-of-operations': 'expression',
  expression: 'expression',
  steps: 'expression',
  'decimal-fractions': 'decimal',
  decimal: 'decimal',
};

const VISUAL_TITLES: Record<string, string> = {
  wordProblem: 'Схема текстовой задачи',
  fractions: 'Схема дроби',
  percent: 'Схема процентов',
  movement: 'Схема движения',
  area: 'Площадь и периметр',
  equation: 'Идея равенства',
  parts: 'Схема частей',
  divisibility: 'Делимость числа',
  measurement: 'Перевод единиц',
  comparison: 'Сравнение величин',
  numberLine: 'Координатный луч',
  expression: 'Порядок действий',
  decimal: 'Десятичная дробь',
};

function resolveVisualType(visualType?: string, topicId?: string): string {
  const raw = visualType ?? topicId ?? 'wordProblem';
  return VISUAL_TYPE_ALIASES[raw] ?? raw;
}

function WordProblemVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-lumen-blue/25 bg-lumen-blue-soft/40 p-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-lumen-blue">Что известно</p>
        <p className="mt-2 text-sm text-lumen-graphite-light">Числа и факты из условия</p>
      </div>
      <div className="flex items-center justify-center">
        <span className="text-2xl font-light text-lumen-teal">→</span>
      </div>
      <div className="rounded-xl border border-lumen-teal/25 bg-lumen-teal-soft/40 p-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-lumen-teal">Что найти</p>
        <p className="mt-2 text-sm text-lumen-graphite-light">Главный вопрос задачи</p>
      </div>
      <div className="rounded-xl border border-lumen-graphite/15 bg-lumen-bg p-4 text-center sm:col-span-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-lumen-graphite">Какое действие поможет</p>
        <p className="mt-2 text-sm text-lumen-graphite-light">
          Связь между данными → выбор действия → ответ
        </p>
      </div>
    </div>
  );
}

function FractionVisual() {
  const parts = 8;
  const filled = 3;
  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-lumen-graphite">3 из 8 частей</p>
      <div className="mx-auto max-w-md">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-lumen-silver">
          Целое
        </p>
        <div className="flex h-16 overflow-hidden rounded-xl border-2 border-lumen-graphite/20">
          {Array.from({ length: parts }).map((_, i) => (
            <div
              key={i}
              className={`flex flex-1 items-end justify-center border-r border-lumen-graphite/10 pb-1 text-[10px] font-medium last:border-r-0 ${
                i < filled ? 'bg-lumen-teal/45 text-lumen-graphite' : 'bg-lumen-silver-light/60 text-lumen-silver'
              }`}
            >
              {i < filled ? 'часть' : ''}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2 text-sm font-medium text-lumen-graphite-light">
        <span>Целое разделено на {parts} частей</span>
        <span className="text-lumen-teal">Сколько взяли: {filled} части</span>
      </div>
    </div>
  );
}

function PercentVisual() {
  const value = 40;
  return (
    <div className="space-y-4">
      <div className="relative mx-auto h-10 max-w-md overflow-hidden rounded-full bg-lumen-silver-light">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between text-sm font-medium text-lumen-graphite-light">
        <span>0%</span>
        <span className="text-lumen-teal">Часть — {value}%</span>
        <span>100% — всё</span>
      </div>
    </div>
  );
}

function MovementVisual() {
  return (
    <div className="space-y-5">
      <div className="relative mx-auto max-w-md px-4">
        <div className="h-1.5 rounded-full bg-lumen-silver-light" />
        <div className="absolute -top-3 left-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-lumen-blue bg-lumen-surface text-sm font-bold text-lumen-blue">
          A
        </div>
        <div className="absolute -top-3 right-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-lumen-teal bg-lumen-surface text-sm font-bold text-lumen-teal">
          B
        </div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xl text-lumen-blue">→</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-lumen-blue-soft/50 px-2 py-3">
          <p className="text-sm font-semibold text-lumen-blue">Скорость</p>
        </div>
        <div className="rounded-xl bg-lumen-bg px-2 py-3">
          <p className="text-sm font-semibold text-lumen-graphite-light">× Время</p>
        </div>
        <div className="rounded-xl bg-lumen-teal-soft/50 px-2 py-3">
          <p className="text-sm font-semibold text-lumen-teal">Расстояние</p>
        </div>
      </div>
    </div>
  );
}

function AreaVisual() {
  return (
    <div className="mx-auto max-w-xs space-y-3">
      <div className="relative mx-auto h-32 w-48 border-2 border-lumen-graphite/25 bg-lumen-teal-soft/20">
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium text-lumen-blue">
          длина
        </span>
        <span className="absolute -right-14 top-1/2 -translate-y-1/2 text-sm font-medium text-lumen-teal">
          ширина
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-lumen-graphite/70">
          площадь
        </span>
      </div>
      <p className="text-center text-sm text-lumen-graphite-light">
        Площадь = длина × ширина
      </p>
    </div>
  );
}

function EquationVisual() {
  return (
    <div className="mx-auto max-w-sm space-y-4">
      <div className="flex items-end justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-20 rounded-xl border-2 border-lumen-blue/30 bg-lumen-blue-soft/40" />
          <span className="text-sm font-medium text-lumen-blue">левая часть</span>
        </div>
        <span className="pb-3 text-3xl font-light text-lumen-graphite">=</span>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-20 rounded-xl border-2 border-lumen-teal/30 bg-lumen-teal-soft/40" />
          <span className="text-sm font-medium text-lumen-teal">правая часть</span>
        </div>
      </div>
      <div className="mx-auto h-1.5 w-52 rounded-full bg-lumen-graphite/30" />
      <p className="text-center text-sm text-lumen-graphite-light">
        Обе стороны равны — как весы в равновесии
      </p>
    </div>
  );
}

function PartsVisual() {
  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-lumen-graphite">Целое разделено на равные части</p>
      <div className="mx-auto flex h-14 max-w-md overflow-hidden rounded-xl border-2 border-lumen-graphite/20">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`flex flex-1 flex-col items-center justify-center border-r border-lumen-graphite/10 text-xs font-semibold last:border-r-0 ${
              n <= 2 ? 'bg-lumen-teal/40 text-lumen-graphite' : 'bg-lumen-silver-light/50 text-lumen-silver'
            }`}
          >
            <span>1 часть</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-lumen-graphite-light">
        <span>Одна часть</span>
        <span>Несколько частей</span>
        <span className="font-medium text-lumen-teal">Всё вместе = целое</span>
      </div>
    </div>
  );
}

function MeasurementVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        { from: '1 м', to: '100 см', label: 'Длина' },
        { from: '1 кг', to: '1000 г', label: 'Масса' },
        { from: '1 ч', to: '60 мин', label: 'Время' },
      ].map((item) => (
        <div key={item.label} className="rounded-xl border border-lumen-silver-light bg-lumen-bg p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-lumen-teal">{item.label}</p>
          <p className="mt-3 text-base font-semibold text-lumen-graphite">{item.from}</p>
          <p className="my-2 text-sm text-lumen-silver">↓</p>
          <p className="text-base font-semibold text-lumen-blue">{item.to}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonVisual() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <div className="rounded-xl border border-lumen-blue/25 bg-lumen-blue-soft/40 px-8 py-5 text-center">
        <p className="text-3xl font-bold text-lumen-blue">5</p>
        <p className="mt-2 text-sm font-medium text-lumen-silver">первая величина</p>
      </div>
      <span className="text-4xl font-light text-lumen-teal">&gt;</span>
      <div className="rounded-xl border border-lumen-silver-light bg-lumen-bg px-8 py-5 text-center">
        <p className="text-3xl font-bold text-lumen-graphite-light">3</p>
        <p className="mt-2 text-sm font-medium text-lumen-silver">вторая величина</p>
      </div>
    </div>
  );
}

function DivisibilityVisual() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-xl border border-lumen-blue/20 bg-lumen-blue-soft/30 px-5 py-4 text-center">
        <p className="text-3xl font-bold text-lumen-graphite">24</p>
        <p className="mt-2 text-sm text-lumen-graphite-light">Число делится на равные группы</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[6, 6, 6, 6].map((value, index) => (
          <div
            key={index}
            className="rounded-lg border border-lumen-teal/25 bg-lumen-teal-soft/35 py-3 text-center text-sm font-semibold text-lumen-graphite"
          >
            {value}
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-medium text-lumen-teal">Остатка нет — число делится</p>
    </div>
  );
}

function NumberLineVisual() {
  const points = [0, 1, 2, 3, 4, 5];
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="relative pt-6">
        <div className="h-1 rounded-full bg-lumen-silver-light" />
        <div className="absolute left-0 top-4 h-3 w-3 rounded-full bg-lumen-blue" />
        {points.map((n) => (
          <div
            key={n}
            className="absolute top-6 -translate-x-1/2 text-xs font-semibold text-lumen-graphite"
            style={{ left: `${(n / 5) * 100}%` }}
          >
            {n}
          </div>
        ))}
        <div
          className="absolute top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-lumen-teal bg-lumen-teal-soft"
          style={{ left: '60%' }}
        />
      </div>
      <p className="text-center text-sm text-lumen-graphite-light">
        Натуральные числа на луче: 1, 2, 3, 4, 5…
      </p>
    </div>
  );
}

function ExpressionVisual() {
  const steps = [
    { label: '1. Скобки', color: 'border-lumen-blue/25 bg-lumen-blue-soft/40 text-lumen-blue' },
    { label: '2. × и ÷', color: 'border-lumen-teal/25 bg-lumen-teal-soft/40 text-lumen-teal' },
    { label: '3. + и −', color: 'border-lumen-graphite/15 bg-lumen-bg text-lumen-graphite-light' },
  ];
  return (
    <div className="mx-auto max-w-md space-y-4">
      <p className="text-center text-sm font-medium text-lumen-graphite">
        2 + 3 × 4 → сначала 3×4, потом +2
      </p>
      <div className="grid gap-2">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold ${step.color}`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function DecimalVisual() {
  return (
    <div className="mx-auto max-w-sm space-y-4">
      <div className="rounded-xl border-2 border-lumen-graphite/20 bg-lumen-bg px-6 py-5 text-center">
        <p className="text-3xl font-bold tracking-wider text-lumen-graphite">
          <span className="text-lumen-blue">12</span>
          <span className="text-lumen-teal">,</span>
          <span className="text-lumen-teal">5</span>
        </p>
      </div>
      <div className="flex justify-between text-sm font-medium text-lumen-graphite-light">
        <span>Целая часть</span>
        <span>Дробная часть</span>
      </div>
      <p className="text-center text-sm text-lumen-graphite-light">
        Запятая отделяет целое от частей
      </p>
    </div>
  );
}

const visualMap: Record<string, () => ReactNode> = {
  wordProblem: WordProblemVisual,
  fractions: FractionVisual,
  percent: PercentVisual,
  movement: MovementVisual,
  area: AreaVisual,
  equation: EquationVisual,
  parts: PartsVisual,
  divisibility: DivisibilityVisual,
  measurement: MeasurementVisual,
  comparison: ComparisonVisual,
  numberLine: NumberLineVisual,
  expression: ExpressionVisual,
  decimal: DecimalVisual,
};

export function VisualExplanationCard({
  topicId,
  visualType,
  className = '',
}: VisualExplanationCardProps) {
  const resolvedType = resolveVisualType(visualType, topicId);
  const Visual = visualMap[resolvedType] ?? WordProblemVisual;
  const title = VISUAL_TITLES[resolvedType] ?? 'Схема задачи';

  return (
    <section className={`lumen-card overflow-hidden ${className}`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue/60 to-lumen-teal/60" />
      <div className="p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
          Покажи наглядно
        </p>
        <h3 className="mt-1 text-base font-semibold text-lumen-graphite sm:text-lg">
          {title}
        </h3>
        <div className="mt-5">{Visual()}</div>
      </div>
    </section>
  );
}
