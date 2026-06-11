import { Link } from 'react-router-dom';
import { getTodayMission } from '../../data/missions';
import { useProgress } from '../../context/ProgressContext';

export function TodayMission() {
  const { progress, completeMission } = useProgress();
  const mission = getTodayMission(progress.currentMissionId);
  const isDone = progress.completedMissions.includes(mission.id);

  return (
    <section className="lumen-card overflow-hidden border-lumen-teal/25 bg-gradient-to-br from-lumen-surface to-lumen-teal-soft/20">
      <div className="absolute inset-x-0 top-0 h-1 bg-lumen-teal" />
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
              Сегодняшняя миссия
            </p>
            <h2 className="mt-2 text-lg font-semibold text-lumen-graphite sm:text-xl">
              {mission.title}
            </h2>
            <p className="mt-2 text-sm text-lumen-graphite-light">
              {mission.description}
            </p>
            {isDone && (
              <p className="mt-3 text-sm font-medium text-lumen-teal">
                Миссия выполнена
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            {mission.topicId && (
              <Link
                to={`/lesson/${mission.topicId}`}
                className="lumen-btn-primary text-center"
              >
                {isDone ? 'Повторить' : 'Начать миссию'}
              </Link>
            )}
            {!isDone && (
              <button
                type="button"
                onClick={() => completeMission(mission.id)}
                className="lumen-btn-secondary text-center text-xs"
              >
                Отметить выполненной
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
