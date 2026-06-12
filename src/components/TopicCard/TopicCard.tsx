import { Link } from 'react-router-dom';
import type { Topic } from '../../types';
import { TOPIC_STATUS_LABELS } from '../../data/topics';
import { useProgress } from '../../context/ProgressContext';

interface TopicCardProps {
  topic: Topic;
}

const difficultyStyles = {
  лёгкий: 'bg-lumen-teal-soft text-lumen-teal',
  средний: 'bg-lumen-blue-soft text-lumen-blue',
  сложный: 'bg-lumen-silver-light text-lumen-graphite-light',
};

const statusStyles: Record<Topic['status'], string> = {
  ready: 'bg-lumen-teal-soft text-lumen-teal',
  'in-progress': 'bg-lumen-blue-soft text-lumen-blue',
  soon: 'bg-lumen-silver-light text-lumen-silver',
};

export function TopicCard({ topic }: TopicCardProps) {
  const { getTopicProgress, isTopicUnlocked } = useProgress();
  const progress = getTopicProgress(topic.id);
  const unlocked = isTopicUnlocked(topic.id);
  const isSoon = topic.status === 'soon';

  if (!unlocked && !isSoon) {
    return (
      <article className="lumen-card flex h-full flex-col opacity-60">
        <div className="flex h-full flex-col p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-lumen-graphite">{topic.title}</h3>
            <span className="shrink-0 rounded-lg bg-lumen-silver-light px-2.5 py-1 text-xs font-medium text-lumen-silver">
              Закрыто
            </span>
          </div>
          <p className="mb-2 text-xs text-lumen-silver">{topic.category}</p>
          <p className="mb-6 flex-1 text-sm text-lumen-silver">
            Сначала продвинься по предыдущей теме — откроется автоматически.
          </p>
        </div>
      </article>
    );
  }

  function actionLabel(): string {
    if (isSoon) return 'Скоро';
    if (topic.status === 'in-progress') return 'Открыть';
    return progress > 0 ? 'Продолжить' : 'Изучать';
  }

  return (
    <article className="lumen-card flex h-full flex-col transition-shadow hover:shadow-[0_12px_40px_rgba(30,41,59,0.12)]">
      <div className="flex h-full flex-col p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-lumen-graphite">{topic.title}</h3>
          <span
            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium ${statusStyles[topic.status]}`}
          >
            {TOPIC_STATUS_LABELS[topic.status]}
          </span>
        </div>

        <p className="mb-2 text-xs text-lumen-silver">{topic.category}</p>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-lumen-graphite-light">
          {topic.description}
        </p>

        <div className="mb-4">
          <span
            className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${difficultyStyles[topic.difficulty]}`}
          >
            {topic.difficulty}
          </span>
        </div>

        <div className="space-y-3">
          {!isSoon && (
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs text-lumen-silver">
                <span>Прогресс</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-lumen-silver-light">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-lumen-teal to-lumen-blue transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Link
            to={`/lesson/${topic.slug}`}
            className={`flex w-full justify-center text-sm ${
              isSoon ? 'lumen-btn-secondary opacity-80' : 'lumen-btn-primary'
            }`}
          >
            {actionLabel()}
          </Link>
        </div>
      </div>
    </article>
  );
}
