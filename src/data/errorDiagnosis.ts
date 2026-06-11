import type { ErrorDiagnosis, ErrorType } from '../types';
import { getErrorDiagnosisMessage } from './lumenMessages';

const ERROR_LABELS: Record<ErrorType, string> = {
  'misunderstood-condition': 'Не понял условие',
  'missed-main-question': 'Не нашёл главный вопрос',
  'confused-data': 'Перепутал данные',
  'wrong-action': 'Выбрал не то действие',
  'calculation-error': 'Ошибся в вычислении',
  'unchecked-answer': 'Ответ не проверен',
  'rushed-to-solution': 'Слишком быстро перешёл к решению',
};

const ERROR_EXPLANATIONS: Record<ErrorType, string> = {
  'misunderstood-condition':
    'Задача — это короткая история. Сначала нужно понять, о чём она, а потом искать числа.',
  'missed-main-question':
    'В каждой задаче есть главный вопрос — то, что нужно найти. Без него легко выбрать не то действие.',
  'confused-data':
    'Числа в условии нужно разложить по смыслу: что дано, а что относится к вопросу.',
  'wrong-action':
    'Данные найдены верно, но действие не совпадает со связью между числами.',
  'calculation-error':
    'Логика решения верная, но в счёте закралась ошибка. Это легко поправить.',
  'unchecked-answer':
    'Ответ получен, но его стоит проверить: подходит ли он по смыслу задачи.',
  'rushed-to-solution':
    'Решение начали раньше, чем разобрали вопрос и данные. Сначала понимание, потом счёт.',
};

const ERROR_WHAT_TO_DO: Record<ErrorType, string> = {
  'misunderstood-condition': 'Перечитай условие и своими словами скажи, о чём задача.',
  'missed-main-question': 'Найди в конце условия вопрос — что именно нужно узнать.',
  'confused-data': 'Выпиши отдельно все числа и подпиши, что каждое означает.',
  'wrong-action': 'Посмотри на связь между числами и выбери действие заново.',
  'calculation-error': 'Пересчитай спокойно, шаг за шагом, без спешки.',
  'unchecked-answer': 'Спроси себя: ответ похож на правду? Можно ли проверить другим способом?',
  'rushed-to-solution': 'Вернись к вопросу задачи и данным — потом снова к решению.',
};

const ERROR_TARGET_STEP: Record<ErrorType, number> = {
  'misunderstood-condition': 0,
  'missed-main-question': 2,
  'confused-data': 1,
  'wrong-action': 4,
  'calculation-error': 5,
  'unchecked-answer': 6,
  'rushed-to-solution': 2,
};

const STEP_TO_ERROR: Record<number, ErrorType> = {
  1: 'misunderstood-condition',
  2: 'confused-data',
  3: 'missed-main-question',
  4: 'confused-data',
  5: 'wrong-action',
  6: 'calculation-error',
  7: 'unchecked-answer',
};

export function diagnoseStepError(
  stepId: number,
  options?: { rushed?: boolean },
): ErrorDiagnosis {
  let type: ErrorType;

  if (options?.rushed && (stepId === 5 || stepId === 6)) {
    type = 'rushed-to-solution';
  } else {
    type = STEP_TO_ERROR[stepId] ?? 'confused-data';
  }

  return {
    type,
    label: ERROR_LABELS[type],
    lumenMessage: getErrorDiagnosisMessage(type),
    explanation: ERROR_EXPLANATIONS[type],
    whatToDo: ERROR_WHAT_TO_DO[type],
    targetStepIndex: ERROR_TARGET_STEP[type],
  };
}

export function getTrainingFocusLabels(stats: {
  missedQuestionCount: number;
  wrongActionCount: number;
  calculationErrorCount: number;
  uncheckedAnswerCount: number;
  misunderstoodConditionCount: number;
  confusedDataCount: number;
  rushedCount: number;
}): string[] {
  const focusMap: { count: number; label: string }[] = [
    { count: stats.missedQuestionCount + stats.rushedCount, label: 'Учимся находить главный вопрос' },
    { count: stats.wrongActionCount, label: 'Тренируем выбор действия' },
    { count: stats.calculationErrorCount, label: 'Улучшаем вычисления' },
    { count: stats.uncheckedAnswerCount, label: 'Учимся проверять ответ' },
    { count: stats.misunderstoodConditionCount, label: 'Учимся читать условие' },
    { count: stats.confusedDataCount, label: 'Тренируем работу с данными' },
  ];

  const sorted = focusMap
    .filter((f) => f.count > 0)
    .sort((a, b) => b.count - a.count);

  if (sorted.length === 0) {
    return ['Разбираем задачи по шагам', 'Учимся понимать, а не заучивать'];
  }

  return sorted.slice(0, 3).map((f) => f.label);
}

export { ERROR_LABELS };
