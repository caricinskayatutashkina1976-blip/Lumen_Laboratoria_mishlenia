import { Link } from 'react-router-dom';
import { getWhyNeededByTopicId } from '../../data/lessons';
import { LumenAvatar } from '../LumenAvatar/LumenAvatar';

interface WhyNeedItCardProps {
  topicId: string;
  topicTitle: string;
  topicSlug: string;
}

export function WhyNeedItCard({ topicId, topicTitle, topicSlug }: WhyNeedItCardProps) {
  const reasons = getWhyNeededByTopicId(topicId);
  const preview = reasons[0] ?? 'Эта тема пригодится в жизни и помогает тренировать мышление.';

  return (
    <section className="lumen-card overflow-hidden border-lumen-blue/20">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue/60 to-lumen-teal/60" />
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <LumenAvatar size="sm" showLabel={false} className="shrink-0" />

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
                Зачем мне это нужно?
              </p>
              <h2 className="mt-1 text-lg font-semibold text-lumen-graphite sm:text-xl">
                {topicTitle}
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
              {preview}
            </p>

            {reasons.length > 1 && (
              <ul className="space-y-2">
                {reasons.slice(1, 3).map((reason, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-lumen-graphite-light"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lumen-teal" />
                    {reason}
                  </li>
                ))}
              </ul>
            )}

            <Link
              to={`/why/${topicSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-lumen-blue transition-colors hover:text-lumen-graphite"
            >
              Подробнее о пользе темы
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
