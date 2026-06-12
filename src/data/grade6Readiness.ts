import type { NextStepRecommendationData, StoredProgress } from '../types';
import { getProblemsByTopicId } from './problems';
import { getReviewTopics, getTopicBySlug, topics } from './topics';

export interface ReadinessOption {
  text: string;
  isCorrect: boolean;
}

export interface ReadinessQuestion {
  id: string;
  text: string;
  options: ReadinessOption[];
}

/** Темы для блока «Перед этой темой полезно повторить» */
export const GRADE6_REVIEW_BEFORE: Record<string, string[]> = {
  'signed-numbers': ['natural-numbers', 'comparison', 'number-line'],
  'coordinate-line': ['natural-numbers', 'comparison', 'number-line'],
  'absolute-value': ['signed-numbers', 'coordinate-line', 'comparison'],
};

/** Темы 5 класса, ошибки в которых важны для перехода в 6 класс */
export const GRADE6_FOUNDATION_SLUGS = [
  'natural-numbers',
  'order-of-operations',
  'fractions',
  'percents',
  'equations',
  'comparison',
] as const;

export const GRADE6_READINESS_QUESTIONS: Record<string, ReadinessQuestion[]> = {
  'signed-numbers': [
    {
      id: 'sn-1',
      text: 'Какое число больше: 8 или 5?',
      options: [
        { text: '8', isCorrect: true },
        { text: '5', isCorrect: false },
        { text: 'Они равны', isCorrect: false },
      ],
    },
    {
      id: 'sn-2',
      text: 'Где на луче числа становятся больше?',
      options: [
        { text: 'Вправо', isCorrect: true },
        { text: 'Влево', isCorrect: false },
        { text: 'Вниз', isCorrect: false },
      ],
    },
    {
      id: 'sn-3',
      text: 'Что значит «ниже нуля» на термометре?',
      options: [
        { text: 'Температура отрицательная', isCorrect: true },
        { text: 'Температура равна нулю', isCorrect: false },
        { text: 'Термометр сломан', isCorrect: false },
      ],
    },
  ],
  'coordinate-line': [
    {
      id: 'cl-1',
      text: 'Что такое ноль на числовой прямой?',
      options: [
        { text: 'Начало отсчёта', isCorrect: true },
        { text: 'Самое большое число', isCorrect: false },
        { text: 'Конец прямой', isCorrect: false },
      ],
    },
    {
      id: 'cl-2',
      text: 'В какую сторону числа увеличиваются?',
      options: [
        { text: 'Вправо', isCorrect: true },
        { text: 'Влево', isCorrect: false },
        { text: 'Вверх', isCorrect: false },
      ],
    },
    {
      id: 'cl-3',
      text: 'Как сравнить два числа по их положению?',
      options: [
        { text: 'Правее — больше', isCorrect: true },
        { text: 'Левее — больше', isCorrect: false },
        { text: 'Сравнивать нельзя', isCorrect: false },
      ],
    },
  ],
  'absolute-value': [
    {
      id: 'av-1',
      text: 'Что такое расстояние?',
      options: [
        { text: 'На сколько единиц от одной точки до другой', isCorrect: true },
        { text: 'Направление движения', isCorrect: false },
        { text: 'Знак числа', isCorrect: false },
      ],
    },
    {
      id: 'av-2',
      text: 'Может ли расстояние быть отрицательным?',
      options: [
        { text: 'Нет', isCorrect: true },
        { text: 'Да', isCorrect: false },
        { text: 'Только для отрицательных чисел', isCorrect: false },
      ],
    },
    {
      id: 'av-3',
      text: 'Где находится ноль на координатной прямой?',
      options: [
        { text: 'В точке начала отсчёта', isCorrect: true },
        { text: 'Справа от всех чисел', isCorrect: false },
        { text: 'Слева от всех чисел', isCorrect: false },
      ],
    },
  ],
};

export type Grade6ReadinessLevel = 'low' | 'medium' | 'high';

export interface Grade6ReadinessAssessment {
  level: Grade6ReadinessLevel;
  message: string;
  reviewPercent: number;
  weakFoundationTopics: string[];
  grade6Started: boolean;
}

function topicHadErrors(topicId: string, progress: StoredProgress): boolean {
  const problems = getProblemsByTopicId(topicId);
  return problems.some((p) => progress.problemProgress?.[p.id]?.hadError);
}

function getTopicProgressValue(topicId: string, progress: StoredProgress): number {
  return progress.topicProgress[topicId] ?? 0;
}

export function assessGrade6Readiness(progress: StoredProgress): Grade6ReadinessAssessment {
  const reviewTopics = getReviewTopics();
  const reviewPercents = reviewTopics.map((t) => getTopicProgressValue(t.id, progress));
  const reviewPercent =
    reviewPercents.length === 0
      ? 0
      : Math.round(reviewPercents.reduce((a, b) => a + b, 0) / reviewPercents.length);

  const weakFoundationTopics = GRADE6_FOUNDATION_SLUGS.filter((slug) => {
    const topic = getTopicBySlug(slug);
    if (!topic || topic.status !== 'ready') return false;
    const tp = getTopicProgressValue(topic.id, progress);
    const hadErrors = topicHadErrors(topic.id, progress);
    return tp < 40 || hadErrors;
  }).map((slug) => getTopicBySlug(slug)!.title);

  const grade6Started = topics
    .filter((t) => t.grade === 6)
    .some((t) => getTopicProgressValue(t.id, progress) > 0);

  let level: Grade6ReadinessLevel;
  let message: string;

  if (reviewPercent < 25 && weakFoundationTopics.length >= 4) {
    level = 'low';
    message =
      'Перед 6 классом полезно повторить базу: числа, дроби, проценты и уравнения.';
  } else if (reviewPercent >= 55 && weakFoundationTopics.length <= 1) {
    level = 'high';
    message = 'Ты готов переходить к темам 6 класса.';
  } else {
    level = 'medium';
    message = 'Хорошее начало. Осталось укрепить несколько тем перед 6 классом.';
  }

  return {
    level,
    message,
    reviewPercent,
    weakFoundationTopics,
    grade6Started,
  };
}

export function getWeakReviewBeforeTopics(
  topicSlug: string,
  getTopicProgress: (id: string) => number,
): { slug: string; title: string }[] {
  const slugs = GRADE6_REVIEW_BEFORE[topicSlug] ?? [];
  return slugs
    .map((slug) => getTopicBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .filter((t) => getTopicProgress(t.id) < 40)
    .map((t) => ({ slug: t.slug, title: t.title }));
}

export function getGrade6PrerequisiteRecommendation(
  topicSlug: string,
  getTopicProgress: (id: string) => number,
  progress: StoredProgress,
): NextStepRecommendationData | null {
  const topic = getTopicBySlug(topicSlug);
  if (!topic || topic.grade !== 6) return null;

  const weakBefore = getWeakReviewBeforeTopics(topicSlug, getTopicProgress);
  const foundationWeak = GRADE6_FOUNDATION_SLUGS.filter((slug) => {
    const t = getTopicBySlug(slug);
    if (!t || t.status !== 'ready') return false;
    return getTopicProgress(t.id) < 35 || topicHadErrors(t.id, progress);
  }).map((slug) => getTopicBySlug(slug)!.title);

  const names = [...new Set([...weakBefore.map((t) => t.title), ...foundationWeak])].slice(0, 3);
  if (names.length === 0) return null;

  const text =
    names.length === 1
      ? `Эта тема будет понятнее, если сначала повторить «${names[0]}».`
      : `Эта тема будет понятнее, если сначала повторить ${names.slice(0, -1).join(', ')} и ${names[names.length - 1]}.`;

  const firstWeak = weakBefore[0] ?? GRADE6_FOUNDATION_SLUGS.find((s) => {
    const t = getTopicBySlug(s);
    return t && getTopicProgress(t.id) < 35;
  });

  return {
    summary: 'Люмен подсказывает',
    title: 'Можно сначала повторить базу',
    text,
    primaryLabel: 'Открыть повторение',
    primaryLink: '/map?grade=review',
    secondaryLabel: firstWeak ? `Повторить: ${getTopicBySlug(firstWeak.slug)?.title ?? ''}` : 'К темам 5 класса',
    secondaryLink: firstWeak ? `/lesson/${firstWeak.slug}` : '/map?grade=5',
  };
}
