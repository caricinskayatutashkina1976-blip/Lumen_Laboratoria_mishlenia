import type { Topic, TopicGroupId, TopicStatus } from '../types';
import { TOPIC_GROUPS } from './topicGroups';
import { topicDefinitions } from './topicDefinitions';

export const topics: Topic[] = topicDefinitions;

/** Темы с контентом — участвуют в расчёте общего прогресса */
export const activeTopicIds = topics
  .filter((t) => t.status === 'ready' || t.status === 'in-progress')
  .map((t) => t.id);

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

export function getTopicsByGroup(groupId: TopicGroupId): Topic[] {
  return getSortedTopics().filter((t) => t.group === groupId);
}

export function getGroupedTopics(): { group: (typeof TOPIC_GROUPS)[number]; topics: Topic[] }[] {
  return TOPIC_GROUPS.map((group) => ({
    group,
    topics: getTopicsByGroup(group.id),
  }));
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

export function isTopicAvailable(topic: Topic): boolean {
  return topic.status === 'ready' || topic.status === 'in-progress';
}

export { TOPIC_GROUPS } from './topicGroups';
