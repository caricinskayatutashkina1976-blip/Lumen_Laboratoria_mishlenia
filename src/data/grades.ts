import type { Grade } from '../types';

export const GRADE_VIEW_OPTIONS: { id: Grade; label: string }[] = [
  { id: 5, label: '5 класс' },
  { id: 6, label: '6 класс' },
  { id: 'review', label: 'Повторение' },
];

export const GRADE_PATH_COPY: Record<
  Grade,
  { sectionLabel: string; title: string; description: string; mapHint: string }
> = {
  5: {
    sectionLabel: '5 класс',
    title: 'База: числа, дроби, задачи, геометрия и величины',
    description:
      'Не нужно проходить всё сразу. Двигаемся спокойно: одна тема, одна задача, один понятный шаг.',
    mapHint:
      'Программа математики 5 класса. Темы сгруппированы по разделам — от чисел и вычислений к задачам, геометрии и логике.',
  },
  6: {
    sectionLabel: '6 класс',
    title: 'Следующий уровень: отрицательные числа, пропорции, рациональные числа, уравнения и координаты',
    description:
      'Раздел 6 класса готовится. Уже можно повторить базу 5 класса — это поможет легче перейти к новым темам.',
    mapHint:
      'Программа математики 6 класса. Темы появятся поэтапно — сначала можно укрепить базу из 5 класса.',
  },
  review: {
    sectionLabel: 'Повторение',
    title: 'Если тема забылась, можно вернуться к ней без страха',
    description:
      'Повторение — это часть обучения. Здесь собраны ключевые темы 5 класса перед переходом к 6.',
    mapHint:
      'Повторение помогает спокойно перейти к 6 классу. Здесь собраны темы, которые часто нужны в новых разделах.',
  },
};

export function parseGradeView(value: string | null | undefined): Grade {
  if (value === '6') return 6;
  if (value === 'review') return 'review';
  return 5;
}

export function gradeViewToParam(grade: Grade): string {
  return String(grade);
}
