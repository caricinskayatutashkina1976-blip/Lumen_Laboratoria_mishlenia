import type {
  Difficulty,
  Problem,
  ProblemDifficultyLevel,
  TrainingSkill,
} from '../../types';
import { buildProblemSteps, type StepData } from '../problemSteps';

export interface ProblemDraft {
  id: string;
  topicId: string;
  title: string;
  level: ProblemDifficultyLevel;
  problemText: string;
  lifeContext: string;
  correctAnswer: string;
  commonMistake: string;
  visualType: string;
  relatedSkill: TrainingSkill;
  simpleExplanation: string;
  about?: string;
  known?: string;
  find?: string;
  findWrong?: [string, string];
  connection?: string;
  action?: string;
  actionWrong?: [string, string];
  solution?: string;
  check?: string;
  hints?: string[];
}

const LEVEL_MAP: Record<ProblemDifficultyLevel, Difficulty> = {
  easy: 'лёгкий',
  medium: 'средний',
  hard: 'сложный',
};

const STEP_WRONG: Record<number, [string, string]> = {
  0: ['Не понял условие', 'Сразу начать считать'],
  1: ['Только одно число', 'Числа не важны'],
  2: ['Количество предметов', 'Цена одного предмета'],
  3: ['Числа не связаны', 'Нужно угадывать'],
  4: ['Только сложение', 'Только деление'],
  5: ['Ответ наугад', 'Пропустить счёт'],
  6: ['Не проверять', 'Ответ точно неверный'],
};

function opts(correct: string, wrong: [string, string]): string[] {
  return [correct, wrong[0], wrong[1]];
}

export function buildProblem(draft: ProblemDraft): Problem {
  const about = draft.about ?? draft.lifeContext;
  const known = draft.known ?? 'Числа и факты из условия задачи.';
  const find = draft.find ?? 'Главный вопрос из конца условия.';
  const findWrong = draft.findWrong ?? STEP_WRONG[2];
  const connection =
    draft.connection ?? 'Данные связаны между собой и ведут к ответу.';
  const action = draft.action ?? 'Подходящее действие по смыслу задачи.';
  const actionWrong = draft.actionWrong ?? STEP_WRONG[4];
  const solution = draft.solution ?? draft.correctAnswer;
  const check =
    draft.check ?? 'Ответ похож на правду и проверяется обратным действием.';

  const stepData: StepData[] = [
    {
      hint: 'Кто действует и что происходит?',
      content: about,
      simpleExplanation: draft.simpleExplanation,
      answerOptions: opts('Понял, о чём задача', ['Не понял условие', 'Сразу начать считать']),
      expectedAnswer: 'Понял, о чём задача',
    },
    {
      hint: 'Выпиши все числа и факты.',
      content: known,
      simpleExplanation: 'Сначала собери все данные из условия.',
      answerOptions: opts('Все нужные данные записаны', ['Только одно число', 'Числа не важны']),
      expectedAnswer: 'Все нужные данные записаны',
    },
    {
      hint: 'Найди главный вопрос в конце.',
      content: find,
      simpleExplanation: 'Вопрос задачи показывает, что искать.',
      answerOptions: opts(find, findWrong),
      expectedAnswer: find,
    },
    {
      hint: 'Как связаны данные?',
      content: connection,
      simpleExplanation: 'Связь подсказывает, что делать дальше.',
      answerOptions: opts('Данные связаны логически', STEP_WRONG[3]),
      expectedAnswer: 'Данные связаны логически',
    },
    {
      hint: 'Выбери действие по смыслу.',
      content: action,
      simpleExplanation: 'Действие следует из связи между числами.',
      answerOptions: opts(action, actionWrong),
      expectedAnswer: action,
    },
    {
      hint: 'Посчитай по шагам.',
      content: solution,
      simpleExplanation: draft.simpleExplanation,
      expectedAnswer: solution.replace(/[^\d/]/g, '').slice(0, 6) || solution.slice(0, 8),
    },
    {
      hint: 'Проверь ответ.',
      content: check,
      simpleExplanation: 'Ответ должен иметь смысл в задаче.',
      answerOptions: opts('Да, ответ похож на правду', STEP_WRONG[6]),
      expectedAnswer: 'Да, ответ похож на правду',
    },
  ];

  const hints = draft.hints ?? [
    'Прочитай условие два раза.',
    'Найди главный вопрос.',
    draft.commonMistake,
  ];

  return {
    id: draft.id,
    topicId: draft.topicId,
    topicSlug: draft.topicId,
    title: draft.title,
    difficulty: LEVEL_MAP[draft.level],
    difficultyLevel: draft.level,
    condition: draft.problemText,
    problemText: draft.problemText,
    lifeContext: draft.lifeContext,
    answer: draft.correctAnswer,
    correctAnswer: draft.correctAnswer,
    steps: buildProblemSteps(stepData),
    hints,
    simpleExplanation: draft.simpleExplanation,
    commonMistake: draft.commonMistake,
    visualType: draft.visualType,
    relatedSkill: draft.relatedSkill,
  };
}

export function buildProblems(drafts: ProblemDraft[]): Problem[] {
  return drafts.map(buildProblem);
}
