import { Link } from 'react-router-dom';
import type { Grade } from '../../types';
import { GRADE_PATH_COPY, gradeViewToParam } from '../../data/grades';
import { CURRICULUM_PATH } from '../../data/topicGroups';
import { countReadyTopics, getTopicsByGrade, getTopicsByGroup } from '../../data/topics';

interface CurriculumPathProps {
  compact?: boolean;
  gradeView?: Grade;
}

export function CurriculumPath({ compact = false, gradeView = 5 }: CurriculumPathProps) {
  const copy = GRADE_PATH_COPY[gradeView];
  const readyCount = countReadyTopics(gradeView);

  return (
    <section className="lumen-card overflow-hidden border-l-4 border-lumen-blue/30">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue/60 to-lumen-teal/60" />
      <div className={compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}>
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
          {copy.sectionLabel}
        </p>
        <h2
          className={`mt-2 font-semibold text-lumen-graphite ${
            compact ? 'text-lg' : 'text-xl sm:text-2xl'
          }`}
        >
          Твой путь по математике
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-lumen-graphite">
          {copy.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light">
          {copy.description}
        </p>

        {gradeView === 5 && (
          <ol className="mt-6 space-y-3">
            {CURRICULUM_PATH.map((step) => {
              const groupReadyCount = getTopicsByGroup(step.groupId, 5).filter(
                (t) => t.status === 'ready',
              ).length;
              return (
                <li
                  key={step.groupId}
                  className="flex items-start gap-3 rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lumen-blue-soft text-xs font-semibold text-lumen-blue">
                    {step.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-lumen-graphite">{step.title}</p>
                    <p className="mt-0.5 text-xs text-lumen-silver">
                      Готово тем: {groupReadyCount}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {gradeView === 6 && (
          <div className="mt-6 rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-4">
            <p className="text-sm text-lumen-graphite-light">
              В программе 6 класса — {countReadyTopics(6)} готовых тем из{' '}
              {getTopicsByGrade(6).length} запланированных. Пока можно укрепить базу в разделе
              «Повторение».
            </p>
          </div>
        )}

        {gradeView === 'review' && (
          <div className="mt-6 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/30 px-4 py-4">
            <p className="text-sm text-lumen-graphite-light">
              Готово к повторению: {readyCount} тем. Выбери ту, где хочешь освежить понимание.
            </p>
          </div>
        )}

        <Link
          to={`/map?grade=${gradeViewToParam(gradeView)}`}
          className="lumen-btn-secondary mt-6 inline-flex text-sm"
        >
          Открыть карту тем
        </Link>
      </div>
    </section>
  );
}
