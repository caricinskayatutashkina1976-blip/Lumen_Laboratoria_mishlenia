import type { Problem, ProblemStatus, StoredProgress, TrainingSkill } from '../types';
import { getEasyProblemForSkill, getProblemById, getProblemsByTopicId, problems } from '../data/problems';
import { getPrimaryWeakSkill } from './recommendations';

export type ProblemFilterId =
  | 'all'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'unsolved'
  | 'with-errors'
  | 'recommended';

export function getProblemStatus(
  problemId: string,
  progress: StoredProgress,
): ProblemStatus {
  const entry = progress.problemProgress?.[problemId];
  if (entry?.status) return entry.status;
  if (progress.solvedProblems.includes(problemId)) return 'solved';
  return 'not-started';
}

export function getProblemStatusLabel(status: ProblemStatus): string {
  const labels: Record<ProblemStatus, string> = {
    'not-started': 'Не начата',
    'in-progress': 'В процессе',
    solved: 'Решена',
    'solved-with-hint': 'Решена с подсказкой',
    'needs-retry': 'Нужно повторить',
  };
  return labels[status];
}

export function getRecommendedProblemIds(progress: StoredProgress, topicId?: string): string[] {
  const weakSkill = getPrimaryWeakSkill(progress.errorStats);
  const pool = topicId ? getProblemsByTopicId(topicId) : problems;

  const recommended: string[] = [];

  if (weakSkill) {
    const skillProblems = pool
      .filter((p) => p.relatedSkill === weakSkill && !progress.solvedProblems.includes(p.id))
      .sort((a, b) => levelOrder(a.difficultyLevel) - levelOrder(b.difficultyLevel));
    if (skillProblems[0]) recommended.push(skillProblems[0].id);
  }

  const retryProblems = pool.filter(
    (p) => progress.problemProgress?.[p.id]?.status === 'needs-retry',
  );
  retryProblems.forEach((p) => {
    if (!recommended.includes(p.id)) recommended.push(p.id);
  });

  if (recommended.length === 0) {
    const next = pool.find((p) => !progress.solvedProblems.includes(p.id));
    if (next) recommended.push(next.id);
  }

  return recommended.slice(0, 3);
}

function levelOrder(level: string): number {
  return level === 'easy' ? 0 : level === 'medium' ? 1 : 2;
}

export function filterProblems(
  list: Problem[],
  filter: ProblemFilterId,
  progress: StoredProgress,
  topicId?: string,
): Problem[] {
  const recommended = getRecommendedProblemIds(progress, topicId);

  switch (filter) {
    case 'easy':
      return list.filter((p) => p.difficultyLevel === 'easy');
    case 'medium':
      return list.filter((p) => p.difficultyLevel === 'medium');
    case 'hard':
      return list.filter((p) => p.difficultyLevel === 'hard');
    case 'unsolved':
      return list.filter((p) => !progress.solvedProblems.includes(p.id));
    case 'with-errors':
      return list.filter((p) => progress.problemProgress?.[p.id]?.hadError);
    case 'recommended':
      return list.filter((p) => recommended.includes(p.id));
    default:
      return list;
  }
}

export function getProblemOfDay(progress: StoredProgress): Problem {
  const today = new Date().toISOString().slice(0, 10);

  if (progress.dailyProblemDate === today && progress.dailyProblemId) {
    const cached = getProblemById(progress.dailyProblemId);
    if (cached) return cached;
  }

  const totalErrors =
    progress.errorStats.missedQuestionCount +
    progress.errorStats.wrongActionCount +
    progress.errorStats.calculationErrorCount;

  if (progress.overallProgress === 0 && progress.solvedProblems.length === 0) {
    return getProblemsByTopicId('text-problems').find((p) => p.difficultyLevel === 'easy')!;
  }

  if (totalErrors > 0) {
    const weakSkill = getPrimaryWeakSkill(progress.errorStats);
    if (weakSkill) {
      const skillProblem = getEasyProblemForSkill(weakSkill);
      if (skillProblem && !progress.solvedProblems.includes(skillProblem.id)) {
        return skillProblem;
      }
    }
  }

  const activeTopic =
    progress.selectedTopics[progress.selectedTopics.length - 1] ?? 'text-problems';
  const unsolved = getProblemsByTopicId(activeTopic).find(
    (p) => !progress.solvedProblems.includes(p.id),
  );
  if (unsolved) return unsolved;

  const anyUnsolved = problems.find((p) => !progress.solvedProblems.includes(p.id));
  return anyUnsolved ?? problems[0];
}

export function getRecommendationProblem(
  progress: StoredProgress,
  skill?: TrainingSkill,
): Problem | undefined {
  const targetSkill = skill ?? getPrimaryWeakSkill(progress.errorStats);
  if (!targetSkill) return undefined;
  return getEasyProblemForSkill(targetSkill);
}

export function buildProblemRecommendationText(problem: Problem): string {
  const skillTexts: Record<TrainingSkill, string> = {
    'find-question':
      'Сейчас полезно решить простую задачу на главный вопрос. Она поможет понять, что именно нужно найти.',
    'find-data':
      'Попробуй эту задачу — в ней важно аккуратно собрать все данные из условия.',
    'choose-operation':
      'Сейчас полезно решить простую задачу на выбор действия. Она поможет понять, когда нужно умножать, а когда складывать.',
    calculate:
      'Эта задача поможет потренировать счёт, сохранив правильный ход решения.',
    'check-answer':
      'Попробуй эту задачу — в ней важно проверить, похож ли ответ на правду.',
  };
  return skillTexts[problem.relatedSkill] ?? `Попробуй задачу «${problem.title}».`;
}
