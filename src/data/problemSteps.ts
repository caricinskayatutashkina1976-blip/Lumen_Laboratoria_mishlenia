import type { ProblemStep } from '../types';

const STEP_TITLES = [
  'О чём задача?',
  'Что известно?',
  'Что нужно найти?',
  'Какая связь между данными?',
  'Какое действие подходит?',
  'Решение',
  'Проверка ответа',
] as const;

interface StepData {
  hint: string;
  content: string;
  simpleExplanation: string;
}

export function buildProblemSteps(steps: StepData[]): ProblemStep[] {
  return steps.map((step, index) => ({
    id: index + 1,
    title: STEP_TITLES[index] ?? `Шаг ${index + 1}`,
    hint: step.hint,
    content: step.content,
    simpleExplanation: step.simpleExplanation,
    completed: false,
  }));
}
