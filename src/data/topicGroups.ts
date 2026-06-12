import type { TopicGroup, TopicGroupId } from '../types';

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    id: 'numbers',
    title: 'Числа и вычисления',
    description: 'Натуральные числа, действия и порядок вычислений.',
    order: 1,
  },
  {
    id: 'fractions',
    title: 'Дроби и проценты',
    description: 'Обыкновенные и десятичные дроби, проценты.',
    order: 2,
  },
  {
    id: 'life',
    title: 'Задачи из жизни',
    description: 'Текстовые задачи из покупок, движения и повседневных ситуаций.',
    order: 3,
  },
  {
    id: 'geometry',
    title: 'Геометрия и величины',
    description: 'Фигуры, измерения, площадь, периметр и единицы.',
    order: 4,
  },
  {
    id: 'data',
    title: 'Данные и мышление',
    description: 'Таблицы, диаграммы, уравнения и логика.',
    order: 5,
  },
];

export const GROUP_TITLES: Record<TopicGroupId, string> = {
  numbers: 'Числа и вычисления',
  fractions: 'Дроби и проценты',
  life: 'Задачи из жизни',
  geometry: 'Геометрия и величины',
  data: 'Данные и мышление',
};

export const CURRICULUM_PATH = [
  { step: 1, title: 'Сначала числа и вычисления', groupId: 'numbers' as TopicGroupId },
  { step: 2, title: 'Потом дроби и проценты', groupId: 'fractions' as TopicGroupId },
  { step: 3, title: 'Затем задачи из жизни', groupId: 'life' as TopicGroupId },
  { step: 4, title: 'После этого геометрия и величины', groupId: 'geometry' as TopicGroupId },
  { step: 5, title: 'Потом таблицы, диаграммы и логика', groupId: 'data' as TopicGroupId },
];
