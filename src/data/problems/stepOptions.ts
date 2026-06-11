import type { ErrorType, StepAnswerOption } from '../../types';
import type { ProblemDraft } from './problemDraft';

function option(
  text: string,
  isCorrect: boolean,
  feedback: string,
  errorType: ErrorType | null = isCorrect ? null : 'confused-data',
): StepAnswerOption {
  return { text, isCorrect, feedback, errorType };
}

export function buildAboutOptions(draft: ProblemDraft): StepAnswerOption[] {
  return [
    option(
      'Понял, о чём задача',
      true,
      `Верно. Это задача про ${draft.lifeContext || 'ситуацию из условия'}.`,
    ),
    option(
      'Не понял условие',
      false,
      'Сначала прочитай условие как короткую историю: кто действует и что происходит.',
      'misunderstood-condition',
    ),
    option(
      'Сразу начать считать',
      false,
      'Счёт пригодится позже. Сначала важно понять, о чём задача.',
      'rushed-to-solution',
    ),
  ];
}

export function buildKnownOptions(): StepAnswerOption[] {
  return [
    option(
      'Все нужные данные записаны',
      true,
      'Верно. Ты собрал числа и факты, которые понадобятся для решения.',
    ),
    option(
      'Только одно число',
      false,
      'В условии обычно несколько данных. Выпиши все числа и подпиши, что они означают.',
      'confused-data',
    ),
    option(
      'Числа не важны',
      false,
      'Числа — это опора задачи. Без них нельзя выбрать действие и проверить ответ.',
      'misunderstood-condition',
    ),
  ];
}

export function buildFindOptions(
  find: string,
  findWrong: [string, string],
): StepAnswerOption[] {
  return [
    option(find, true, 'Верно. Это главный вопрос задачи — к нему и нужно прийти.'),
    option(
      findWrong[0],
      false,
      'Это полезная мысль, но не главный вопрос. Посмотри, что спрашивают в конце условия.',
      'missed-main-question',
    ),
    option(
      findWrong[1],
      false,
      'Здесь важно найти именно то, что нужно узнать, а не отдельную деталь.',
      'missed-main-question',
    ),
  ];
}

export function buildConnectionOptions(connection: string): StepAnswerOption[] {
  return [
    option(
      'Данные связаны логически',
      true,
      `Верно. ${connection}`,
    ),
    option(
      'Числа не связаны',
      false,
      'Числа в задаче обычно связаны смыслом. Подумай, как одно помогает найти другое.',
      'confused-data',
    ),
    option(
      'Нужно угадывать',
      false,
      'Угадывать не нужно. Связь между данными подсказывает, какое действие выбрать.',
      'wrong-action',
    ),
  ];
}

export function buildActionOptions(
  draft: ProblemDraft,
  action: string,
  actionWrong: [string, string],
): StepAnswerOption[] {
  if (draft.actionOptions?.length) {
    return draft.actionOptions;
  }

  const actionLower = action.toLowerCase();

  if (actionLower.includes('×') || actionLower.includes('умнож')) {
    const usesAddition = actionLower.includes('прибав') || actionLower.includes('слож');
    const correctLabel = usesAddition ? 'Умножение и сложение' : 'Умножение';

    return [
      option(
        'Сложение',
        false,
        'Сложение подходит, когда нужно собрать уже готовые части. Здесь одна цена повторяется несколько раз, поэтому сначала нужно умножение.',
        'wrong-action',
      ),
      option(
        correctLabel,
        true,
        usesAddition
          ? 'Верно. Сначала находим стоимость повторяющихся покупок умножением, потом добавляем остальное сложением.'
          : 'Верно. Одна и та же величина повторяется несколько раз — удобнее умножить.',
      ),
      option(
        'Деление',
        false,
        'Деление помогает узнать, сколько приходится на одну часть. Здесь нужно найти общий результат, поэтому деление не подходит.',
        'wrong-action',
      ),
    ];
  }

  if (actionLower.includes('−') || actionLower.includes('выч')) {
    return [
      option(
        'Вычитание',
        true,
        'Верно. Нужно узнать, сколько останется или какова разница между величинами.',
      ),
      option(
        actionWrong[0],
        false,
        'Это действие не совпадает со смыслом задачи. Здесь нужно найти остаток или разницу.',
        'wrong-action',
      ),
      option(
        actionWrong[1],
        false,
        'Подумай: нужно ли здесь уменьшать одно число на другое.',
        'wrong-action',
      ),
    ];
  }

  if (actionLower.includes('÷') || actionLower.includes('дел')) {
    return [
      option(
        'Деление',
        true,
        'Верно. Нужно разделить целое на равные части или узнать, сколько раз одно число содержится в другом.',
      ),
      option(
        actionWrong[0],
        false,
        'Это действие не помогает разделить целое на части.',
        'wrong-action',
      ),
      option(
        actionWrong[1],
        false,
        'Посмотри на связь данных: здесь важно именно деление.',
        'wrong-action',
      ),
    ];
  }

  return [
    option(
      'Сложение',
      true,
      `Верно. ${action}`,
    ),
    option(
      actionWrong[0],
      false,
      'Это действие не совпадает со связью между числами в задаче.',
      'wrong-action',
    ),
    option(
      actionWrong[1],
      false,
      'Подумай ещё раз: какое действие помогает собрать или сравнить данные.',
      'wrong-action',
    ),
  ];
}

export function buildCheckOptions(check: string): StepAnswerOption[] {
  return [
    option(
      'Да, ответ похож на правду',
      true,
      `Верно. ${check}`,
    ),
    option(
      'Не проверять',
      false,
      'Проверка — важный шаг. Она показывает, имеет ли ответ смысл в задаче.',
      'unchecked-answer',
    ),
    option(
      'Ответ точно неверный',
      false,
      'Если ответ получился логично, сначала проверь его обратным действием или оценкой по смыслу.',
      'unchecked-answer',
    ),
  ];
}

export function buildFindAcceptedAnswers(draft: ProblemDraft, find: string): string[] {
  if (draft.findAcceptedAnswers?.length) {
    return draft.findAcceptedAnswers;
  }

  return [
    find,
    find.replace('?', '').trim(),
    'сколько всего',
    'общая стоимость',
    'общая цена',
  ];
}

export function buildFindKeywords(draft: ProblemDraft): string[] {
  if (draft.findKeywords?.length) {
    return draft.findKeywords;
  }

  return ['сколько', 'найти', 'узнать', 'всего', 'остал', 'стоимость', 'цена', 'рубл'];
}

export function buildSolutionAcceptedAnswers(
  draft: ProblemDraft,
  solution: string,
): string[] {
  if (draft.solutionAcceptedAnswers?.length) {
    return draft.solutionAcceptedAnswers;
  }

  const numeric = solution.match(/\d+/g) ?? [];
  return [solution, ...numeric, draft.correctAnswer];
}

export function buildSolutionKeywords(draft: ProblemDraft, solution: string): string[] {
  if (draft.solutionKeywords?.length) {
    return draft.solutionKeywords;
  }

  const numeric = solution.match(/\d+/g) ?? [];
  return [...numeric, 'рубл', 'равно'];
}
