import { Link } from 'react-router-dom';
import { TodayMission } from '../components/TodayMission/TodayMission';
import { getTodayMission } from '../data/missions';
import { getSortedTopics } from '../data/topics';
import { useProgress } from '../context/ProgressContext';

export function TopicMapPage() {
  const { progress, getTopicProgress, isTopicUnlocked, topicsMastered } = useProgress();
  const sortedTopics = getSortedTopics();
  const mission = getTodayMission(progress.currentMissionId);
  const overallProgress = progress.overallProgress;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="lumen-section-label">Путь обучения</p>
        <h1 className="lumen-page-title mt-2">Карта тем</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          Твой маршрут по математике 5–6 класса. Открывай темы, выполняй миссии и
          двигайся вперёд шаг за шагом.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="lumen-card p-5">
          <p className="text-xs text-lumen-silver">Общий прогресс</p>
          <p className="mt-1 text-2xl font-bold text-lumen-graphite">{overallProgress}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-lumen-silver-light">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        <div className="lumen-card p-5">
          <p className="text-xs text-lumen-silver">Тем освоено</p>
          <p className="mt-1 text-2xl font-bold text-lumen-teal">{topicsMastered}</p>
        </div>
        <div className="lumen-card border-lumen-teal/25 p-5">
          <p className="text-xs text-lumen-teal">Текущая миссия</p>
          <p className="mt-1 text-sm font-semibold text-lumen-graphite">{mission.title}</p>
        </div>
      </div>

      <div className="mb-10">
        <TodayMission />
      </div>

      <section>
        <h2 className="mb-6 text-lg font-semibold text-lumen-graphite">
          Маршрут по темам
        </h2>

        <div className="relative space-y-0">
          <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-lumen-teal via-lumen-blue to-lumen-silver-light sm:block" />

          {sortedTopics.map((topic, index) => {
            const unlocked = isTopicUnlocked(topic.id);
            const topicProgress = getTopicProgress(topic.id);
            const mastered = topicProgress >= 70;
            const inProgress = topicProgress > 0 && topicProgress < 70;

            return (
              <div key={topic.id} className="relative flex gap-4 pb-8 sm:gap-6">
                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-sm font-bold shadow-sm ${
                      !unlocked
                        ? 'border-lumen-silver-light bg-lumen-bg text-lumen-silver'
                        : mastered
                          ? 'border-lumen-teal bg-lumen-teal-soft text-lumen-teal'
                          : inProgress
                            ? 'border-lumen-blue bg-lumen-blue-soft text-lumen-blue'
                            : 'border-lumen-graphite/20 bg-lumen-surface text-lumen-graphite'
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                <article
                  className={`lumen-card flex-1 p-5 sm:p-6 ${
                    !unlocked ? 'opacity-55' : ''
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-lumen-graphite">{topic.title}</h3>
                        {!unlocked && (
                          <span className="rounded-lg bg-lumen-silver-light px-2 py-0.5 text-xs text-lumen-silver">
                            Впереди
                          </span>
                        )}
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
                        {unlocked && topicProgress === 0 && (
                          <span className="rounded-lg bg-lumen-bg px-2 py-0.5 text-xs text-lumen-silver">
                            Открыто
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-lumen-graphite-light">
                        {topic.description}
                      </p>
                      <p className="mt-2 text-xs text-lumen-silver">
                        Сложность: {topic.difficulty}
                      </p>
                    </div>

                    {unlocked ? (
                      <Link
                        to={`/lesson/${topic.slug}`}
                        className="lumen-btn-primary shrink-0 text-center"
                      >
                        {topicProgress > 0 ? 'Продолжить' : 'Начать'}
                      </Link>
                    ) : (
                      <span className="shrink-0 rounded-xl border border-dashed border-lumen-silver-light px-4 py-2.5 text-xs text-lumen-silver">
                        Нужен прогресс по предыдущей теме
                      </span>
                    )}
                  </div>

                  {unlocked && (
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs text-lumen-silver">
                        <span>Прогресс</span>
                        <span>{topicProgress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-lumen-silver-light">
                        <div
                          className="h-full rounded-full bg-lumen-teal transition-all"
                          style={{ width: `${topicProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </article>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
