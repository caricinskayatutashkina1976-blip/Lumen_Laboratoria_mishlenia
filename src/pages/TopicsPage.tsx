import { Link } from 'react-router-dom';
import { TopicCard } from '../components/TopicCard/TopicCard';
import { TodayMission } from '../components/TodayMission/TodayMission';
import { getSortedTopics } from '../data/topics';

export function TopicsPage() {
  const sortedTopics = getSortedTopics();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <Link to="/" className="text-sm text-lumen-silver transition-colors hover:text-lumen-blue">
          ← На главную
        </Link>
        <h1 className="lumen-page-title mt-4">Каталог тем</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          Выбери тему, которую хочешь понять. Каждая карточка показывает сложность и
          твой прогресс.
        </p>
      </div>

      <div className="mb-8">
        <TodayMission />
      </div>

      <div className="mb-10 lumen-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="lumen-section-label">Нужна помощь?</p>
            <h2 className="mt-1 text-lg font-semibold text-lumen-graphite">Я не понял тему</h2>
            <p className="mt-1 text-sm text-lumen-graphite-light">
              Люмен поможет объяснить проще и найти подходящую тему для старта.
            </p>
          </div>
          <Link to="/lesson/text-problems" className="lumen-btn-primary shrink-0">
            Начать с основ
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/map" className="text-sm font-medium text-lumen-blue hover:underline">
          Смотреть карту обучения →
        </Link>
      </div>
    </div>
  );
}
