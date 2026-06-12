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
    category: 'Работа над ошибками',
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
  {
    id: 'training-found-question',
    title: 'Нашёл главный вопрос',
    description: 'Успешно прошёл тренировку по поиску главного вопроса.',
    unlocked: false,
    category: 'Работа над ошибками',
  },
  {
    id: 'training-chose-action',
    title: 'Выбрал действие осознанно',
    description: 'Потренировал выбор действия и понял связь между числами.',
    unlocked: false,
    category: 'Работа над ошибками',
  },
  {
    id: 'training-checked-answer',
    title: 'Проверил ответ',
    description: 'Научился проверять ответ и оценивать, похож ли он на правду.',
    unlocked: false,
    category: 'Работа над ошибками',
  },
  {
    id: 'strengthened-weakness',
    title: 'Укрепил слабое место',
    description: 'Прошёл мини-тренировку и закрепил навык, который давался сложнее.',
    unlocked: false,
    category: 'Работа над ошибками',
  },
  {
    id: 'homework-steps-done',
    title: 'Разобрал домашнюю задачу',
    description: 'Прошёл все шаги разбора домашней задачи без готового ответа.',
    unlocked: false,
    category: 'Домашка',
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}
