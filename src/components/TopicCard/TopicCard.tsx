import { Link } from 'react-router-dom';
import type { Topic } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface TopicCardProps {
  topic: Topic;
}

const difficultyStyles = {
  лёгкий: 'bg-lumen-teal-soft text-lumen-teal',
  средний: 'bg-lumen-blue-soft text-lumen-blue',
  сложный: 'bg-lumen-silver-light text-lumen-graphite-light',
};

export function TopicCard({ topic }: TopicCardProps) {
  const { getTopicProgress, isTopicUnlocked } = useProgress();
  const progress = getTopicProgress(topic.id);
  const unlocked = isTopicUnlocked(topic.id);

  if (!unlocked) {
    return (
      <article className="lumen-card flex h-full flex-col opacity-60">
        <div className="flex h-full flex-col p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-lumen-graphite">{topic.title}</h3>
            <span className="shrink-0 rounded-lg bg-lumen-silver-light px-2.5 py-1 text-xs font-medium text-lumen-silver">
              Закрыто
            </span>
          </div>
          <p className="mb-6 flex-1 text-sm text-lumen-silver">
            Сначала продвинься по предыдущей теме — откроется автоматически.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="lumen-card flex h-full flex-col transition-shadow hover:shadow-[0_12px_40px_rgba(30,41,59,0.12)]">
      <div className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-lumen-graphite">{topic.title}</h3>
          <span
            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium ${difficultyStyles[topic.difficulty]}`}
          >
            {topic.difficulty}
          </span>
        </div>

        <p className="mb-6 flex-1 text-sm leading-relaxed text-lumen-graphite-light">
          {topic.description}
        </p>

        <div className="space-y-3">
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

          <Link to={`/lesson/${topic.slug}`} className="lumen-btn-primary flex w-full justify-center">
            Начать
          </Link>
        </div>
      </div>
    </article>
  );
}
