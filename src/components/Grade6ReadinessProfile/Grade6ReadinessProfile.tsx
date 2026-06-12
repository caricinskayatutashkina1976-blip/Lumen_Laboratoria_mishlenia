import { Link } from 'react-router-dom';
import { assessGrade6Readiness } from '../../data/grade6Readiness';
import type { StoredProgress } from '../../types';

interface Grade6ReadinessProfileProps {
  progress: StoredProgress;
}

export function Grade6ReadinessProfile({ progress }: Grade6ReadinessProfileProps) {
  const assessment = assessGrade6Readiness(progress);

  const barColor =
    assessment.level === 'high'
      ? 'from-lumen-teal to-lumen-blue'
      : assessment.level === 'medium'
        ? 'from-lumen-blue to-lumen-teal'
        : 'from-lumen-blue/70 to-lumen-silver';

  return (
    <section className="lumen-card border-l-4 border-lumen-blue/30 p-5 sm:p-6">
      <p className="lumen-section-label">6 класс</p>
      <h2 className="mt-2 text-lg font-semibold text-lumen-graphite">Готовность к 6 классу</h2>
      <p className="mt-3 text-sm leading-relaxed text-lumen-graphite-light">
        {assessment.message}
      </p>

      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-xs text-lumen-silver">
          <span>Повторение базы</span>
          <span>{assessment.reviewPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-lumen-silver-light">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
            style={{ width: `${assessment.reviewPercent}%` }}
          />
        </div>
      </div>

      {assessment.weakFoundationTopics.length > 0 && (
        <div className="mt-4 rounded-xl bg-lumen-bg px-4 py-3">
          <p className="text-xs font-medium text-lumen-silver">Стоит укрепить</p>
          <ul className="mt-2 space-y-1 text-sm text-lumen-graphite-light">
            {assessment.weakFoundationTopics.slice(0, 4).map((title) => (
              <li key={title}>· {title}</li>
            ))}
          </ul>
        </div>
      )}

      {assessment.grade6Started && (
        <p className="mt-4 text-sm text-lumen-teal">Ты уже начал темы 6 класса — продолжай в своём темпе.</p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to="/map?grade=review" className="lumen-btn-primary text-sm">
          Раздел повторения
        </Link>
        <Link to="/map?grade=6" className="lumen-btn-secondary text-sm">
          Темы 6 класса
        </Link>
      </div>
    </section>
  );
}
