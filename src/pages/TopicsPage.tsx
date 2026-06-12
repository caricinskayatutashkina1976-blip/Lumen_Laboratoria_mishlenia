import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopicCard } from '../components/TopicCard/TopicCard';
import { TodayMission } from '../components/TodayMission/TodayMission';
import { GradeSwitcher } from '../components/GradeSwitcher/GradeSwitcher';
import { GRADE_PATH_COPY } from '../data/grades';
import {
  filterTopics,
  filterTopicsByGradeView,
  getGroupedTopics,
  getSortedTopics,
  type TopicFilterId,
} from '../data/topics';
import { useGradeView } from '../hooks/useGradeView';

const FILTERS: { id: TopicFilterId; label: string }[] = [
  { id: 'all', label: 'Все темы' },
  { id: 'ready', label: 'Готовые' },
  { id: 'in-progress', label: 'В разработке' },
  { id: 'soon', label: 'Скоро' },
  { id: 'numbers', label: 'Числа' },
  { id: 'fractions', label: 'Дроби' },
  { id: 'life', label: 'Задачи' },
  { id: 'geometry', label: 'Геометрия' },
  { id: 'data', label: 'Данные' },
];

export function TopicsPage() {
  const { gradeView, setGradeView } = useGradeView();
  const [filter, setFilter] = useState<TopicFilterId>('all');

  const gradeTopics = filterTopicsByGradeView(getSortedTopics(), gradeView);
  const filtered = filterTopics(gradeTopics, filter);
  const grouped = getGroupedTopics(gradeView);
  const useGrouped = filter === 'all';
  const copy = GRADE_PATH_COPY[gradeView];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <Link to="/" className="text-sm text-lumen-silver transition-colors hover:text-lumen-blue">
          ← На главную
        </Link>
        <h1 className="lumen-page-title mt-4">Каталог тем</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          {copy.mapHint}
        </p>
      </div>

      <div className="mb-6">
        <GradeSwitcher value={gradeView} onChange={setGradeView} />
      </div>

      {gradeView === 6 && (
        <div className="mb-6 lumen-card border-l-4 border-lumen-blue/25 p-5">
          <p className="text-sm leading-relaxed text-lumen-graphite-light">
            Раздел 6 класса готовится. Уже можно повторить базу 5 класса.
          </p>
          <Link to="/map?grade=review" className="mt-3 inline-block text-sm font-medium text-lumen-blue hover:underline">
            Перейти к повторению →
          </Link>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all sm:text-sm ${
              filter === f.id
                ? 'border-lumen-blue bg-lumen-blue-soft text-lumen-blue'
                : 'border-lumen-silver-light bg-lumen-bg text-lumen-graphite-light hover:border-lumen-teal/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mb-6 text-sm text-lumen-silver">
        Показано: {filtered.length} из {gradeTopics.length}
      </p>

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

      {useGrouped ? (
        <div className="space-y-12">
          {grouped.map(({ group, topics }) => {
            if (topics.length === 0) return null;
            return (
              <section key={group.id}>
                <h2 className="mb-4 text-lg font-semibold text-lumen-graphite">{group.title}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {topics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="lumen-card p-8 text-center text-sm text-lumen-graphite-light">
          В этом фильтре тем пока нет. Попробуй другой раздел.
        </div>
      )}

      <div className="mt-10 text-center">
        <Link to={`/map?grade=${gradeView}`} className="text-sm font-medium text-lumen-blue hover:underline">
          Смотреть карту обучения →
        </Link>
      </div>
    </div>
  );
}
