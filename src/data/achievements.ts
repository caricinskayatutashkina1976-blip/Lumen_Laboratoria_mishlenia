import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first-step',
    title: 'Первый шаг',
    description: 'Открыл урок и начал разбираться с темой.',
    unlocked: false,
    category: 'Старт',
  },
  {
    id: 'see-question',
    title: 'Вижу вопрос задачи',
    description: 'Нашёл, что именно нужно найти в условии.',
    unlocked: false,
    category: 'Текстовые задачи',
  },
  {
    id: 'found-main',
    title: 'Нашёл главное',
    description: 'Отделил важные данные от лишней информации.',
    unlocked: false,
    category: 'Текстовые задачи',
  },
  {
    id: 'solved-no-hint',
    title: 'Решил без подсказки',
    description: 'Дошёл до ответа, почти не используя подсказки.',
    unlocked: false,
    category: 'Решение',
  },
  {
    id: 'fix-error',
    title: 'Исправил ошибку сам',
    description: 'Нашёл ошибку и исправил без готового ответа.',
    unlocked: false,
    category: 'Решение',
  },
  {
    id: 'explain-own-words',
    title: 'Объяснил своими словами',
    description: 'Сформулировал ход решения своими словами.',
    unlocked: false,
    category: 'Понимание',
  },
  {
    id: 'motion-master',
    title: 'Мастер задач на движение',
    description: 'Решил две задачи на движение с пошаговым разбором.',
    unlocked: false,
    category: 'Движение',
  },
  {
    id: 'fraction-expert',
    title: 'Знаток дробей',
    description: 'Уверенно работаешь с дробями в задачах.',
    unlocked: false,
    category: 'Дроби',
  },
  {
    id: 'confident-solver',
    title: 'Уверенный решатель',
    description: 'Решил три задачи с полным разбором по шагам.',
    unlocked: false,
    category: 'Решение',
  },
  {
    id: 'understand-not-memorize',
    title: 'Понимаю, а не заучиваю',
    description: 'Прошёл все шаги разбора и понял логику решения.',
    unlocked: false,
    category: 'Понимание',
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}
