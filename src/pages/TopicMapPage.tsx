import { TodayMission } from '../components/TodayMission/TodayMission';

import { CurriculumPath } from '../components/CurriculumPath/CurriculumPath';

import { GradeSwitcher } from '../components/GradeSwitcher/GradeSwitcher';

import { TopicMapCard } from '../components/TopicMapCard/TopicMapCard';

import { getTodayMission } from '../data/missions';

import { GRADE_PATH_COPY } from '../data/grades';

import {

  activeTopicIdsGrade5,

  activeTopicIdsGrade6,

  countReadyTopics,

  filterTopicsByGradeView,

  getGroupedTopics,

  getSortedTopics,

  reviewTopicIds,

} from '../data/topics';

import { useGradeView } from '../hooks/useGradeView';

import { useProgress } from '../context/ProgressContext';

import type { Grade } from '../types';



function getProgressForGrade(gradeView: Grade, gradeProgress: ReturnType<typeof useProgress>['gradeProgress']) {

  if (gradeView === 6) return gradeProgress[6];

  if (gradeView === 'review') return gradeProgress.review;

  return gradeProgress[5];

}



function getReadyCountForGrade(gradeView: Grade) {

  if (gradeView === 6) return activeTopicIdsGrade6.length;

  if (gradeView === 'review') return reviewTopicIds.length;

  return activeTopicIdsGrade5.length;

}



export function TopicMapPage() {

  const { gradeView, setGradeView } = useGradeView();

  const { progress, gradeProgress, getTopicProgress, isTopicUnlocked, topicsMastered } =

    useProgress();



  const visibleTopics = filterTopicsByGradeView(getSortedTopics(), gradeView);

  const groupedTopics = getGroupedTopics(gradeView);

  const mission = getTodayMission(progress.currentMissionId);

  const displayProgress = getProgressForGrade(gradeView, gradeProgress);

  const readyCount = getReadyCountForGrade(gradeView);

  const copy = GRADE_PATH_COPY[gradeView];



  return (

    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

      <div className="mb-8">

        <p className="lumen-section-label">Путь обучения</p>

        <h1 className="lumen-page-title mt-2">Карта тем</h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">

          {copy.mapHint}

        </p>

      </div>



      <div className="mb-8">

        <GradeSwitcher value={gradeView} onChange={setGradeView} />

      </div>



      {gradeView === 6 && (

        <div className="mb-8 lumen-card border-l-4 border-lumen-blue/25 p-5 sm:p-6">

          <p className="text-sm leading-relaxed text-lumen-graphite-light">

            Раздел 6 класса готовится. Уже можно повторить базу 5 класса в разделе «Повторение».

          </p>

        </div>

      )}



      <div className="mb-8 grid gap-4 sm:grid-cols-3">

        <div className="lumen-card p-5">

          <p className="text-xs text-lumen-silver">

            Прогресс · {gradeView === 'review' ? 'повторение' : `${gradeView} класс`}

          </p>

          <p className="mt-1 text-2xl font-bold text-lumen-graphite">{displayProgress}%</p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-lumen-silver-light">

            <div

              className="h-full rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal"

              style={{ width: `${displayProgress}%` }}

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

        <CurriculumPath compact gradeView={gradeView} />

      </div>



      {gradeView === 'review' ? (

        <section>

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-lumen-graphite">Темы для повторения</h2>

            <p className="mt-1 text-sm leading-relaxed text-lumen-graphite-light">

              Повторение помогает спокойно перейти к 6 классу. Здесь собраны темы, которые часто нужны в новых разделах.

            </p>

          </div>

          <div className="grid gap-4 lg:grid-cols-2">

            {visibleTopics.map((topic) => (

              <TopicMapCard

                key={topic.id}

                topic={topic}

                progress={getTopicProgress(topic.id)}

                unlocked={isTopicUnlocked(topic.id)}

              />

            ))}

          </div>

        </section>

      ) : (

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

      )}



      <p className="mt-10 text-center text-sm text-lumen-silver">

        Показано тем: {visibleTopics.length} · готово к изучению: {countReadyTopics(gradeView)}

      </p>

    </div>

  );

}


