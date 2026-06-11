import { Link } from 'react-router-dom';
import { getTodayMission } from '../../data/missions';
import { useProgress } from '../../context/ProgressContext';

export function TodayMission() {
  const { progress, completeMission } = useProgress();
  const mission = getTodayMission(progress.currentMissionId);
  const isDone = progress.completedMissions.includes(mission.id);

  return (
    <section className="lumen-card overflow-hidden border-lumen-teal/25 bg-gradient-to-r from-lumen-surface to-lumen-teal-soft/20">
      <div className="absolute inset-y-0 left-0 w-1 bg-lumen-teal" />
      <div className="relative flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
              Сегодняшняя миссия
            </p>
            {isDone && (
              <span className="text-xs font-medium text-lumen-teal">Выполнена</span>
            )}
          </div>
          <h2 className="mt-1 text-base font-semibold text-lumen-graphite sm:text-lg">
            {mission.title}
          </h2>
          <p className="mt-0.5 line-clamp-1 text-sm text-lumen-graphite-light">
            {mission.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {mission.topicId && (
            <Link
              to={`/lesson/${mission.topicId}`}
              className="lumen-btn-primary whitespace-nowrap px-4 py-2.5 text-sm"
            >
              {isDone ? 'Повторить' : 'Начать миссию'}
            </Link>
          )}
          {!isDone && (
            <button
              type="button"
              onClick={() => completeMission(mission.id)}
              className="lumen-btn-secondary whitespace-nowrap px-3 py-2 text-xs"
            >
              Готово
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
