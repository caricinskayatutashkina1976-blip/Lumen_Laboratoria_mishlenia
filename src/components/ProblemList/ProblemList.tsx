import { Link } from 'react-router-dom';
import type { Problem } from '../../types';
import type { StoredProgress } from '../../types';
import {
  filterProblems,
  getProblemStatus,
  getProblemStatusLabel,
  getRecommendedProblemIds,
  type ProblemFilterId,
} from '../../data/problemOfDay';
import { useState } from 'react';

const FILTERS: { id: ProblemFilterId; label: string }[] = [
  { id: 'all', label: 'Все задачи' },
  { id: 'easy', label: 'Простые' },
  { id: 'medium', label: 'Средние' },
  { id: 'hard', label: 'Посложнее' },
  { id: 'unsolved', label: 'Не решённые' },
  { id: 'with-errors', label: 'С ошибками' },
  { id: 'recommended', label: 'Рекомендованные Люменом' },
];

interface ProblemListProps {
  problems: Problem[];
  progress: StoredProgress;
  topicId: string;
}

export function ProblemList({ problems, progress, topicId }: ProblemListProps) {
  const [filter, setFilter] = useState<ProblemFilterId>('all');
  const filtered = filterProblems(problems, filter, progress, topicId);
  const recommended = getRecommendedProblemIds(progress, topicId);

  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
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

      <p className="mb-4 text-sm text-lumen-silver">
        Показано: {filtered.length} из {problems.length}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((problem) => {
          const status = getProblemStatus(problem.id, progress);
          const isRecommended = recommended.includes(problem.id);

          return (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className={`lumen-card group p-5 transition-all hover:border-lumen-blue/30 ${
                isRecommended ? 'border-lumen-teal/30' : ''
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-lumen-bg px-2 py-0.5 text-xs text-lumen-silver">
                  {problem.difficultyLevel === 'easy'
                    ? 'Простая'
                    : problem.difficultyLevel === 'medium'
                      ? 'Средняя'
                      : 'Посложнее'}
                </span>
                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
                    status === 'solved'
                      ? 'bg-lumen-teal-soft text-lumen-teal'
                      : status === 'solved-with-hint'
                        ? 'bg-lumen-teal-soft/60 text-lumen-teal'
                        : status === 'needs-retry'
                          ? 'bg-lumen-blue-soft text-lumen-blue'
                          : status === 'in-progress'
                            ? 'bg-lumen-blue-soft/50 text-lumen-graphite-light'
                            : 'bg-lumen-bg text-lumen-silver'
                  }`}
                >
                  {getProblemStatusLabel(status)}
                </span>
                {isRecommended && (
                  <span className="rounded-lg bg-lumen-teal-soft px-2 py-0.5 text-xs font-medium text-lumen-teal">
                    Люмен рекомендует
                  </span>
                )}
              </div>

              <h3 className="mt-2 font-medium text-lumen-graphite group-hover:text-lumen-blue">
                {problem.title}
              </h3>
              <p className="mt-1 text-xs text-lumen-teal">{problem.lifeContext}</p>
              <p className="mt-2 line-clamp-2 text-sm text-lumen-graphite-light">
                {problem.problemText}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-lumen-blue">
                Разобрать →
              </span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="lumen-card p-6 text-center text-sm text-lumen-graphite-light">
          В этом фильтре задач пока нет. Попробуй другой вариант.
        </div>
      )}
    </section>
  );
}
