import { Link } from 'react-router-dom';
import { CURRICULUM_PATH } from '../../data/topicGroups';
import { getTopicsByGroup } from '../../data/topics';

interface CurriculumPathProps {
  compact?: boolean;
}

export function CurriculumPath({ compact = false }: CurriculumPathProps) {
  return (
    <section className="lumen-card overflow-hidden border-l-4 border-lumen-blue/30">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue/60 to-lumen-teal/60" />
      <div className={compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}>
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
          Программа 5 класса
        </p>
        <h2
          className={`mt-2 font-semibold text-lumen-graphite ${
            compact ? 'text-lg' : 'text-xl sm:text-2xl'
          }`}
        >
          Твой путь по математике 5 класса
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-lumen-graphite-light">
          Не нужно проходить всё сразу. Двигаемся спокойно: одна тема, одна задача, один
          понятный шаг.
        </p>

        <ol className="mt-6 space-y-3">
          {CURRICULUM_PATH.map((step) => {
            const readyCount = getTopicsByGroup(step.groupId).filter(
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
                    Готово тем: {readyCount}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <Link to="/map" className="lumen-btn-secondary mt-6 inline-flex text-sm">
          Открыть карту тем
        </Link>
      </div>
    </section>
  );
}
