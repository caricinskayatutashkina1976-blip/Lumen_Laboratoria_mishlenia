import type { Problem } from '../../types';
import { buildProblems } from './problemBuilder';
import { problemDrafts } from './problemBank';
import { problemDraftsNewTopics } from './problemBankNewTopics';

export const problems: Problem[] = buildProblems([
  ...problemDrafts,
  ...problemDraftsNewTopics,
]);

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getProblemsByTopicId(topicId: string): Problem[] {
  return problems.filter((p) => p.topicId === topicId);
}

export function getProblemByTopicId(topicId: string): Problem | undefined {
  return getProblemsByTopicId(topicId)[0];
}

export function getProblemsBySkill(skill: string): Problem[] {
  return problems.filter((p) => p.relatedSkill === skill);
}

export function getProblemsByLevel(
  topicId: string,
  level: 'easy' | 'medium' | 'hard',
): Problem[] {
  return getProblemsByTopicId(topicId).filter((p) => p.difficultyLevel === level);
}

export function getEasyProblemForSkill(skill: string): Problem | undefined {
  return problems.find((p) => p.relatedSkill === skill && p.difficultyLevel === 'easy');
}

export { problemDrafts } from './problemBank';
export { buildProblem, buildProblems } from './problemBuilder';
export type { ProblemDraft } from './problemDraft';
