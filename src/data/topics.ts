import type { Grade, GradeLevel, Topic, TopicGroupId, TopicStatus } from '../types';
import { TOPIC_GROUPS } from './topicGroups';
import { topicDefinitions } from './topicDefinitions';

export const topics: Topic[] = topicDefinitions;

function isActiveTopic(topic: Topic): boolean {
  return topic.status === 'ready' || topic.status === 'in-progress';
}

/** Готовые темы 5 класса — участвуют в расчёте общего прогресса (обратная совместимость) */
export const activeTopicIdsGrade5 = topics
  .filter((t) => t.grade === 5 && isActiveTopic(t))
  .map((t) => t.id);

/** Готовые темы 6 класса */
export const activeTopicIdsGrade6 = topics
  .filter((t) => t.grade === 6 && isActiveTopic(t))
  .map((t) => t.id);

/** Темы для раздела «Повторение» */
export const reviewTopicIds = topics
  .filter((t) => t.grade === 5 && t.reviewImportant && isActiveTopic(t))
  .map((t) => t.id);

/** @deprecated Используйте activeTopicIdsGrade5 — сохранено для совместимости */
export const activeTopicIds = activeTopicIdsGrade5;

/** Все id тем (для совместимости) */
export const topicIds = topics.map((t) => t.id);

export type TopicFilterId =
  | 'all'
  | 'ready'
  | 'in-progress'
  | 'soon'
  | 'numbers'
  | 'fractions'
  | 'life'
  | 'geometry'
  | 'data';

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  ready: 'Готово к изучению',
  'in-progress': 'В разработке',
  soon: 'Скоро',
};

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id || t.slug === id);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getSortedTopics(): Topic[] {
  return [...topics].sort((a, b) => a.order - b.order);
}

export function getTopicsByGrade(grade: GradeLevel): Topic[] {
  return getSortedTopics().filter((t) => t.grade === grade);
}

export function getReviewTopics(): Topic[] {
  return getSortedTopics().filter((t) => t.grade === 5 && t.reviewImportant);
}

export function filterTopicsByGradeView(list: Topic[], gradeView: Grade): Topic[] {
  switch (gradeView) {
    case 5:
      return list.filter((t) => t.grade === 5);
    case 6:
      return list.filter((t) => t.grade === 6);
    case 'review':
      return list.filter((t) => t.grade === 5 && t.reviewImportant);
    default:
      return list;
  }
}

export function getTopicsByGroup(groupId: TopicGroupId, gradeView?: Grade): Topic[] {
  const base = getSortedTopics().filter((t) => t.group === groupId);
  return gradeView ? filterTopicsByGradeView(base, gradeView) : base;
}

export function getGroupedTopics(
  gradeView?: Grade,
): { group: (typeof TOPIC_GROUPS)[number]; topics: Topic[] }[] {
  return TOPIC_GROUPS.map((group) => ({
    group,
    topics: getTopicsByGroup(group.id, gradeView),
  })).filter((section) => section.topics.length > 0);
}

export function filterTopics(list: Topic[], filter: TopicFilterId): Topic[] {
  switch (filter) {
    case 'ready':
      return list.filter((t) => t.status === 'ready');
    case 'in-progress':
      return list.filter((t) => t.status === 'in-progress');
    case 'soon':
      return list.filter((t) => t.status === 'soon');
    case 'numbers':
    case 'fractions':
    case 'life':
    case 'geometry':
    case 'data':
      return list.filter((t) => t.group === filter);
    default:
      return list;
  }
}

export function getRelatedReadyTopics(topic: Topic): Topic[] {
  const slugs = topic.relatedTopics ?? [];
  return slugs
    .map((slug) => getTopicBySlug(slug))
    .filter((t): t is Topic => Boolean(t && t.status === 'ready'));
}

/** Темы 5 класса для подготовки к теме 6 класса */
export function getPrerequisiteTopics(topic: Topic): Topic[] {
  const slugs = topic.relatedTopics ?? [];
  return slugs
    .map((slug) => getTopicBySlug(slug))
    .filter(
      (t): t is Topic =>
        Boolean(
          t &&
            t.grade === 5 &&
            (t.status === 'ready' || t.status === 'in-progress'),
        ),
    );
}

export function isTopicAvailable(topic: Topic): boolean {
  return topic.status === 'ready' || topic.status === 'in-progress';
}

export function countReadyTopics(gradeView?: Grade): number {
  const list = gradeView ? filterTopicsByGradeView(topics, gradeView) : topics;
  return list.filter((t) => t.status === 'ready').length;
}

export { TOPIC_GROUPS } from './topicGroups';
