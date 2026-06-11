import type { Topic } from '../types';

export const topics: Topic[] = [
  {
    id: 'text-problems',
    slug: 'text-problems',
    title: 'Текстовые задачи',
    description: 'Научимся читать условие, находить главное и решать по шагам.',
    difficulty: 'средний',
    progress: 0,
    order: 1,
  },
  {
    id: 'fractions',
    slug: 'fractions',
    title: 'Дроби',
    description: 'Поймём, как делить целое на части и работать с долями.',
    difficulty: 'средний',
    progress: 0,
    order: 2,
  },
  {
    id: 'percents',
    slug: 'percents',
    title: 'Проценты',
    description: 'Разберём скидки, проценты и доли от числа.',
    difficulty: 'лёгкий',
    progress: 0,
    order: 3,
  },
  {
    id: 'motion',
    slug: 'motion',
    title: 'Задачи на движение',
    description: 'Связь скорости, времени и расстояния — простыми словами.',
    difficulty: 'сложный',
    progress: 0,
    order: 4,
    unlockAfter: 'text-problems',
  },
  {
    id: 'parts',
    slug: 'parts',
    title: 'Задачи на части',
    description: 'Узнаем, как делить целое на равные части и находить долю.',
    difficulty: 'средний',
    progress: 0,
    order: 5,
    unlockAfter: 'fractions',
  },
  {
    id: 'area-perimeter',
    slug: 'area-perimeter',
    title: 'Площадь и периметр',
    description: 'Как измерять фигуры и считать их размеры.',
    difficulty: 'лёгкий',
    progress: 0,
    order: 6,
  },
  {
    id: 'equations',
    slug: 'equations',
    title: 'Уравнения',
    description: 'Находим неизвестное число, когда часть данных уже известна.',
    difficulty: 'средний',
    progress: 0,
    order: 7,
    unlockAfter: 'text-problems',
  },
  {
    id: 'divisibility',
    slug: 'divisibility',
    title: 'Делимость чисел',
    description: 'Признаки делимости и работа с множителями.',
    difficulty: 'средний',
    progress: 0,
    order: 8,
    unlockAfter: 'fractions',
  },
  {
    id: 'units',
    slug: 'units',
    title: 'Единицы измерения',
    description: 'Переводим метры, килограммы, часы и другие единицы.',
    difficulty: 'лёгкий',
    progress: 0,
    order: 9,
  },
  {
    id: 'comparison',
    slug: 'comparison',
    title: 'Сравнение величин',
    description: 'Сравниваем числа, дроби и величины с разными единицами.',
    difficulty: 'лёгкий',
    progress: 0,
    order: 10,
    unlockAfter: 'units',
  },
];

export const topicIds = topics.map((t) => t.id);

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id || t.slug === id);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getSortedTopics(): Topic[] {
  return [...topics].sort((a, b) => a.order - b.order);
}
