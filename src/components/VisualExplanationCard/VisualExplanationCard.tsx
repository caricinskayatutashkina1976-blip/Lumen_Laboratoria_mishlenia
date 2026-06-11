import type { ReactNode } from 'react';

interface VisualExplanationCardProps {
  topicId: string;
  className?: string;
}

function TextProblemVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-lumen-blue/25 bg-lumen-blue-soft/40 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-lumen-blue">Известно</p>
        <p className="mt-2 text-sm text-lumen-graphite-light">Числа и факты из условия</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="h-0.5 w-full bg-lumen-teal/40 sm:h-full sm:w-0.5" />
      </div>
      <div className="rounded-xl border border-lumen-teal/25 bg-lumen-teal-soft/40 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-lumen-teal">Найти</p>
        <p className="mt-2 text-sm text-lumen-graphite-light">Главный вопрос задачи</p>
      </div>
      <div className="rounded-xl border border-lumen-graphite/15 bg-lumen-bg p-4 text-center sm:col-span-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-lumen-graphite">Действие</p>
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
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-lumen-graphite">3/8 — три части из восьми</p>
      <div className="mx-auto flex h-16 max-w-md overflow-hidden rounded-xl border-2 border-lumen-graphite/20">
        {Array.from({ length: parts }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 border-r border-lumen-graphite/10 last:border-r-0 ${
              i < filled ? 'bg-lumen-teal/50' : 'bg-lumen-silver-light/60'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-lumen-silver">
        <span>Целое разделено на {parts} частей</span>
        <span>Взяли {filled} части</span>
      </div>
    </div>
  );
}

function PercentVisual() {
  const value = 40;
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-lumen-graphite">40% — 40 из 100</p>
      <div className="relative mx-auto h-8 max-w-md overflow-hidden rounded-full bg-lumen-silver-light">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-medium text-lumen-silver">
        <span>0</span>
        <span className="text-lumen-teal">{value}%</span>
        <span>100</span>
      </div>
    </div>
  );
}

function MotionVisual() {
  return (
    <div className="space-y-4">
      <div className="relative mx-auto max-w-md">
        <div className="h-1.5 rounded-full bg-lumen-silver-light" />
        <div className="absolute -top-3 left-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-lumen-blue bg-lumen-surface text-xs font-bold text-lumen-blue">
          A
        </div>
        <div className="absolute -top-3 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-lumen-teal bg-lumen-surface text-xs font-bold text-lumen-teal">
          B
        </div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-lg text-lumen-blue">→</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-lumen-blue-soft/50 px-2 py-2">
          <p className="text-xs font-semibold text-lumen-blue">Скорость</p>
        </div>
        <div className="rounded-lg bg-lumen-bg px-2 py-2">
          <p className="text-xs font-semibold text-lumen-graphite-light">× Время</p>
        </div>
        <div className="rounded-lg bg-lumen-teal-soft/50 px-2 py-2">
          <p className="text-xs font-semibold text-lumen-teal">Расстояние</p>
        </div>
      </div>
    </div>
  );
}

function AreaVisual() {
  return (
    <div className="mx-auto max-w-xs space-y-2">
      <div className="relative mx-auto h-28 w-44 border-2 border-lumen-graphite/25 bg-lumen-teal-soft/20">
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-lumen-blue">
          длина (a)
        </span>
        <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-xs font-medium text-lumen-teal">
          ширина (b)
        </span>
      </div>
      <p className="text-center text-sm text-lumen-graphite-light">
        Площадь = a × b &nbsp;|&nbsp; Периметр = обход по краю
      </p>
    </div>
  );
}

function EquationVisual() {
  return (
    <div className="mx-auto max-w-sm space-y-3">
      <div className="flex items-end justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="h-10 w-16 rounded-lg border-2 border-lumen-blue/30 bg-lumen-blue-soft/40" />
          <span className="text-xs text-lumen-blue">x + 5</span>
        </div>
        <span className="pb-2 text-2xl font-light text-lumen-graphite">=</span>
        <div className="flex flex-col items-center gap-1">
          <div className="h-10 w-16 rounded-lg border-2 border-lumen-teal/30 bg-lumen-teal-soft/40" />
          <span className="text-xs text-lumen-teal">12</span>
        </div>
      </div>
      <div className="mx-auto h-1 w-48 rounded-full bg-lumen-graphite/30" />
      <p className="text-center text-xs text-lumen-silver">Весы в равновесии — обе стороны равны</p>
    </div>
  );
}

function PartsVisual() {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-lumen-graphite">Целое → равные части</p>
      <div className="mx-auto flex h-12 max-w-md overflow-hidden rounded-xl border-2 border-lumen-graphite/20">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`flex flex-1 items-center justify-center border-r border-lumen-graphite/10 text-xs font-medium last:border-r-0 ${
              n <= 2 ? 'bg-lumen-teal/40 text-lumen-graphite' : 'bg-lumen-silver-light/50 text-lumen-silver'
            }`}
          >
            1/4
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-lumen-graphite-light">2 части из 4 = половина</p>
    </div>
  );
}

function UnitsVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        { from: '1 км', to: '1000 м', label: 'Длина' },
        { from: '1 кг', to: '1000 г', label: 'Масса' },
        { from: '1 ч', to: '60 мин', label: 'Время' },
      ].map((item) => (
        <div key={item.label} className="rounded-xl border border-lumen-silver-light bg-lumen-bg p-3 text-center">
          <p className="text-xs font-semibold uppercase text-lumen-teal">{item.label}</p>
          <p className="mt-2 text-sm font-medium text-lumen-graphite">{item.from}</p>
          <p className="text-xs text-lumen-silver">↓</p>
          <p className="text-sm font-medium text-lumen-blue">{item.to}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonVisual() {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="rounded-xl border border-lumen-blue/25 bg-lumen-blue-soft/40 px-6 py-4 text-center">
        <p className="text-2xl font-bold text-lumen-blue">5</p>
        <p className="mt-1 text-xs text-lumen-silver">первое</p>
      </div>
      <span className="text-3xl font-light text-lumen-teal">&gt;</span>
      <div className="rounded-xl border border-lumen-silver-light bg-lumen-bg px-6 py-4 text-center">
        <p className="text-2xl font-bold text-lumen-graphite-light">3</p>
        <p className="mt-1 text-xs text-lumen-silver">второе</p>
      </div>
    </div>
  );
}

function DivisibilityVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        { num: '24', rule: 'Делится на 2', ok: true },
        { num: '35', rule: 'Делится на 5', ok: true },
        { num: '17', rule: 'Не делится на 5', ok: false },
      ].map((item) => (
        <div
          key={item.num}
          className={`rounded-xl border p-3 text-center ${
            item.ok ? 'border-lumen-teal/25 bg-lumen-teal-soft/30' : 'border-lumen-silver-light bg-lumen-bg'
          }`}
        >
          <p className="text-xl font-bold text-lumen-graphite">{item.num}</p>
          <p className="mt-1 text-xs text-lumen-graphite-light">{item.rule}</p>
        </div>
      ))}
    </div>
  );
}

const visualMap: Record<string, () => ReactNode> = {
  'text-problems': TextProblemVisual,
  fractions: FractionVisual,
  percents: PercentVisual,
  motion: MotionVisual,
  'area-perimeter': AreaVisual,
  equations: EquationVisual,
  parts: PartsVisual,
  divisibility: DivisibilityVisual,
  units: UnitsVisual,
  comparison: ComparisonVisual,
};

export function VisualExplanationCard({ topicId, className = '' }: VisualExplanationCardProps) {
  const Visual = visualMap[topicId] ?? TextProblemVisual;

  return (
    <section className={`lumen-card overflow-hidden ${className}`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue/60 to-lumen-teal/60" />
      <div className="p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
          Покажи наглядно
        </p>
        <h3 className="mt-1 text-base font-semibold text-lumen-graphite sm:text-lg">
          Схема темы
        </h3>
        <div className="mt-5">{Visual()}</div>
      </div>
    </section>
  );
}
