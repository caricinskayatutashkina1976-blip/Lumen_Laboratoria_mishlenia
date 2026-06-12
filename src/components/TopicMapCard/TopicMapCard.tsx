import { Link } from 'react-router-dom';
import type { Topic } from '../../types';
import { TOPIC_STATUS_LABELS } from '../../data/topics';

interface TopicMapCardProps {
  topic: Topic;
  progress: number;
  unlocked: boolean;
}

const statusStyles: Record<Topic['status'], string> = {
  ready: 'bg-lumen-teal-soft text-lumen-teal',
  'in-progress': 'bg-lumen-blue-soft text-lumen-blue',
  soon: 'bg-lumen-silver-light text-lumen-silver',
};

export function TopicMapCard({ topic, progress, unlocked }: TopicMapCardProps) {
  const mastered = progress >= 70;
  const inProgress = progress > 0 && progress < 70;
  const isSoon = topic.status === 'soon';

  function renderAction() {
    if (isSoon) {
      return (
        <Link
          to={`/lesson/${topic.slug}`}
          className="lumen-btn-secondary shrink-0 text-center text-sm opacity-80"
        >
          Скоро
        </Link>
      );
    }

    if (!unlocked) {
      return (
        <span className="shrink-0 rounded-xl border border-dashed border-lumen-silver-light px-4 py-2.5 text-xs text-lumen-silver">
          Откроется позже
        </span>
      );
    }

    if (topic.status === 'in-progress') {
      return (
        <Link to={`/lesson/${topic.slug}`} className="lumen-btn-secondary shrink-0 text-center text-sm">
          Открыть
        </Link>
      );
    }

    return (
      <Link to={`/lesson/${topic.slug}`} className="lumen-btn-primary shrink-0 text-center text-sm">
        {progress > 0 ? 'Продолжить' : 'Изучать'}
      </Link>
    );
  }

  return (
    <article className={`lumen-card p-5 sm:p-6 ${!unlocked && !isSoon ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-lumen-graphite">{topic.title}</h3>
            <span
              className={`rounded-lg px-2 py-0.5 text-xs font-medium ${statusStyles[topic.status]}`}
            >
              {TOPIC_STATUS_LABELS[topic.status]}
            </span>
            {unlocked && mastered && (
              <span className="rounded-lg bg-lumen-teal-soft px-2 py-0.5 text-xs font-medium text-lumen-teal">
                Освоено
              </span>
            )}
            {unlocked && inProgress && (
              <span className="rounded-lg bg-lumen-blue-soft px-2 py-0.5 text-xs font-medium text-lumen-blue">
                В процессе
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-lumen-graphite-light">{topic.description}</p>
          <p className="mt-2 text-xs text-lumen-silver">Сложность: {topic.difficulty}</p>
        </div>
        {renderAction()}
      </div>

      {unlocked && !isSoon && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-lumen-silver">
            <span>Прогресс</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-lumen-silver-light">
            <div
              className="h-full rounded-full bg-lumen-teal transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </article>
  );
}
