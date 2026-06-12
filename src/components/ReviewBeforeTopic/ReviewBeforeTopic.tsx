import { Link } from 'react-router-dom';
import type { Topic } from '../../types';
import { GRADE6_REVIEW_BEFORE } from '../../data/grade6Readiness';
import { TOPIC_STATUS_LABELS, getTopicBySlug } from '../../data/topics';

interface ReviewBeforeTopicProps {
  topic: Topic;
}

export function ReviewBeforeTopic({ topic }: ReviewBeforeTopicProps) {
  const slugs = GRADE6_REVIEW_BEFORE[topic.slug] ?? topic.relatedTopics ?? [];
  const related = slugs
    .map((slug) => getTopicBySlug(slug))
    .filter((t): t is Topic => Boolean(t));

  if (related.length === 0) return null;

  return (
    <section className="lumen-card border-l-4 border-lumen-teal/40 p-5 sm:p-6">
      <p className="lumen-section-label">Связь с 5 классом</p>
      <h2 className="mt-2 text-lg font-semibold text-lumen-graphite">
        Перед этой темой полезно повторить
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light">
        Новая тема 6 класса опирается на то, что ты уже проходил. Можно освежить базу — без спешки.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((rel) => {
          const isReady = rel.status === 'ready' || rel.status === 'in-progress';
          return (
            <article
              key={rel.id}
              className="flex flex-col rounded-xl border border-lumen-silver-light bg-lumen-bg p-4"
            >
              <p className="text-xs font-medium text-lumen-silver">
                {rel.grade === 6 ? '6 класс' : '5 класс'}
              </p>
              <h3 className="mt-1 font-medium text-lumen-graphite">{rel.title}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-lumen-graphite-light">
                {rel.description}
              </p>
              {isReady ? (
                <Link
                  to={`/lesson/${rel.slug}`}
                  className="lumen-btn-secondary mt-4 inline-flex text-center text-sm"
                >
                  Повторить
                </Link>
              ) : (
                <span className="mt-4 inline-flex items-center justify-center rounded-xl border border-lumen-silver-light px-4 py-2.5 text-sm font-medium text-lumen-silver">
                  {TOPIC_STATUS_LABELS.soon}
                </span>
              )}
            </article>
          );
        })}
      </div>

      <Link to="/map?grade=review" className="lumen-btn-primary mt-5 inline-flex text-sm">
        Мне сложно, повторить базу
      </Link>
    </section>
  );
}
