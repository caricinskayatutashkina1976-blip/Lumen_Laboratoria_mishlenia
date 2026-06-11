import type {
  Difficulty,
  Problem,
  ProblemDifficultyLevel,
} from '../../types';
import { buildProblemSteps, type StepData } from '../problemSteps';
import type { ProblemDraft } from './problemDraft';
import {
  buildAboutOptions,
  buildActionOptions,
  buildCheckOptions,
  buildConnectionOptions,
  buildFindAcceptedAnswers,
  buildFindKeywords,
  buildFindOptions,
  buildKnownOptions,
  buildSolutionAcceptedAnswers,
  buildSolutionKeywords,
} from './stepOptions';

const LEVEL_MAP: Record<ProblemDifficultyLevel, Difficulty> = {
  easy: 'лёгкий',
  medium: 'средний',
  hard: 'сложный',
};

const STEP_WRONG: Record<number, [string, string]> = {
  2: ['Количество предметов', 'Цена одного предмета'],
  3: ['Числа не связаны', 'Нужно угадывать'],
  4: ['Только сложение', 'Только деление'],
};

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

  const findAcceptedAnswers = buildFindAcceptedAnswers(draft, find);
  const findKeywords = buildFindKeywords(draft);
  const solutionAcceptedAnswers = buildSolutionAcceptedAnswers(draft, solution);
  const solutionKeywords = buildSolutionKeywords(draft, solution);
  const useTextFind = draft.useTextFindStep ?? Boolean(draft.findAcceptedAnswers?.length);

  const stepData: StepData[] = [
    {
      hint: 'Кто действует и что происходит?',
      content: about,
      simpleExplanation: draft.simpleExplanation,
      answerOptions: buildAboutOptions(draft),
    },
    {
      hint: 'Выпиши все числа и факты.',
      content: known,
      simpleExplanation: 'Сначала собери все данные из условия.',
      answerOptions: buildKnownOptions(),
    },
    useTextFind
      ? {
          hint: 'Найди главный вопрос в конце.',
          content: find,
          simpleExplanation: 'Вопрос задачи показывает, что искать.',
          question: 'Что нужно найти? Сформулируй своими словами.',
          expectedAnswer: find,
          acceptedAnswers: findAcceptedAnswers,
          acceptedKeywords: findKeywords,
        }
      : {
          hint: 'Найди главный вопрос в конце.',
          content: find,
          simpleExplanation: 'Вопрос задачи показывает, что искать.',
          answerOptions: buildFindOptions(find, findWrong),
        },
    {
      hint: 'Как связаны данные?',
      content: connection,
      simpleExplanation: 'Связь подсказывает, что делать дальше.',
      answerOptions: buildConnectionOptions(connection),
    },
    {
      hint: 'Выбери действие по смыслу.',
      content: action,
      simpleExplanation: 'Действие следует из связи между числами.',
      answerOptions: buildActionOptions(draft, action, actionWrong),
    },
    {
      hint: 'Посчитай по шагам.',
      content: solution,
      simpleExplanation: draft.simpleExplanation,
      expectedAnswer: solution,
      acceptedAnswers: solutionAcceptedAnswers,
      acceptedKeywords: solutionKeywords,
    },
    {
      hint: 'Проверь ответ.',
      content: check,
      simpleExplanation: 'Ответ должен иметь смысл в задаче.',
      answerOptions: buildCheckOptions(check),
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
