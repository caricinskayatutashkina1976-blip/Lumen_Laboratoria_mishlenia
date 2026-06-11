import type { Mission } from '../types';

export const missions: Mission[] = [
  {
    id: 'mission-find-question',
    title: 'Научиться находить главный вопрос задачи',
    description: 'Открой текстовую задачу и найди, что нужно найти.',
    topicId: 'text-problems',
  },
  {
    id: 'mission-step-by-step',
    title: 'Разобрать одну задачу по шагам',
    description: 'Пройди все 7 шагов разбора любой задачи.',
    topicId: 'text-problems',
  },
  {
    id: 'mission-multiply',
    title: 'Понять, когда нужно умножать',
    description: 'Реши задачу, где главное действие — умножение.',
    topicId: 'text-problems',
  },
  {
    id: 'mission-percents',
    title: 'Потренировать проценты',
    description: 'Разбери одну задачу на проценты с Люменом.',
    topicId: 'percents',
  },
  {
    id: 'mission-fractions',
    title: 'Разобрать задачу на дроби',
    description: 'Пойми, как делить целое на части.',
    topicId: 'fractions',
  },
  {
    id: 'mission-motion',
    title: 'Связать скорость, время и расстояние',
    description: 'Реши задачу на движение по шагам.',
    topicId: 'motion',
  },
];

export function getMissionById(id: string): Mission | undefined {
  return missions.find((m) => m.id === id);
}

export function getTodayMission(currentMissionId: string): Mission {
  return getMissionById(currentMissionId) ?? missions[0];
}
