import { TodayMission } from '../components/TodayMission/TodayMission';
import { CurriculumPath } from '../components/CurriculumPath/CurriculumPath';
import { TopicMapCard } from '../components/TopicMapCard/TopicMapCard';
import { getTodayMission } from '../data/missions';
import { activeTopicIds, getGroupedTopics } from '../data/topics';
import { useProgress } from '../context/ProgressContext';

export function TopicMapPage() {
  const { progress, getTopicProgress, isTopicUnlocked, topicsMastered } = useProgress();
  const groupedTopics = getGroupedTopics();
  const mission = getTodayMission(progress.currentMissionId);
  const overallProgress = progress.overallProgress;
  const readyCount = activeTopicIds.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="lumen-section-label">Путь обучения</p>
        <h1 className="lumen-page-title mt-2">Карта тем</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          Полная программа математики 5 класса. Темы сгруппированы по разделам — от чисел и
          вычислений к задачам, геометрии и логике.
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
          <p className="mt-2 text-xs text-lumen-silver">По {readyCount} готовым темам</p>
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

      <div className="mb-10">
        <CurriculumPath compact />
      </div>

      <div className="space-y-12">
        {groupedTopics.map(({ group, topics: groupTopics }) => (
          <section key={group.id}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-lumen-graphite">{group.title}</h2>
              <p className="mt-1 text-sm text-lumen-graphite-light">{group.description}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {groupTopics.map((topic) => (
                <TopicMapCard
                  key={topic.id}
                  topic={topic}
                  progress={getTopicProgress(topic.id)}
                  unlocked={isTopicUnlocked(topic.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
