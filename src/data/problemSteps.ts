import type { ProblemStep, StepAnswerOption } from '../types';

const STEP_TITLES = [
  'О чём задача?',
  'Что известно?',
  'Что нужно найти?',
  'Какая связь между данными?',
  'Какое действие подходит?',
  'Решение',
  'Проверка ответа',
] as const;

const DEFAULT_QUESTIONS = [
  'Своими словами: о чём эта задача?',
  'Какие числа и факты даны в условии?',
  'Что нужно найти? Сформулируй вопрос.',
  'Как связаны данные между собой?',
  'Какое действие подходит: сложение, вычитание, умножение или деление?',
  'Запиши решение с вычислениями.',
  'Проверь ответ: он похож на правду?',
] as const;

const DEFAULT_WHY = [
  'Сначала нужно понять историю задачи, а не сразу считать.',
  'Без данных нельзя выбрать правильное действие.',
  'Главный вопрос задачи показывает, к чему мы идём.',
  'Связь между числами подсказывает, что делать дальше.',
  'Правильное действие — это следствие понимания, а не угадывание.',
  'Запись решения помогает не потерять ход мысли.',
  'Проверка показывает, что ответ имеет смысл.',
] as const;

export interface StepData {
  hint: string;
  content: string;
  simpleExplanation: string;
  whyNeeded?: string;
  question?: string;
  lumenHint?: string;
  answerOptions?: StepAnswerOption[];
  expectedAnswer?: string;
  acceptedAnswers?: string[];
  acceptedKeywords?: string[];
}

function getExpectedAnswer(step: StepData): string | undefined {
  if (step.expectedAnswer) return step.expectedAnswer;
  return step.answerOptions?.find((option) => option.isCorrect)?.text;
}

export function buildProblemSteps(steps: StepData[]): ProblemStep[] {
  return steps.map((step, index) => ({
    id: index + 1,
    title: STEP_TITLES[index] ?? `Шаг ${index + 1}`,
    hint: step.hint,
    content: step.content,
    simpleExplanation: step.simpleExplanation,
    whyNeeded: step.whyNeeded ?? DEFAULT_WHY[index] ?? step.hint,
    question: step.question ?? DEFAULT_QUESTIONS[index] ?? 'Что ты понял на этом шаге?',
    lumenHint: step.lumenHint ?? step.hint,
    answerOptions: step.answerOptions,
    expectedAnswer: getExpectedAnswer(step),
    acceptedAnswers: step.acceptedAnswers,
    acceptedKeywords: step.acceptedKeywords,
    completed: false,
  }));
}
