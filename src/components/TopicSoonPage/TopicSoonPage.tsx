import { Link } from 'react-router-dom';
import type { Topic } from '../../types';
import {
  TOPIC_STATUS_LABELS,
  getPrerequisiteTopics,
  getRelatedReadyTopics,
} from '../../data/topics';
import { LumenAvatar } from '../LumenAvatar/LumenAvatar';

interface TopicSoonPageProps {
  topic: Topic;
}

export function TopicSoonPage({ topic }: TopicSoonPageProps) {
  const isGrade6 = topic.grade === 6;
  const related = isGrade6 ? getPrerequisiteTopics(topic) : getRelatedReadyTopics(topic);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link to={`/map?grade=${isGrade6 ? 6 : 5}`} className="text-sm text-lumen-silver transition-colors hover:text-lumen-blue">
        ← К карте тем
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <LumenAvatar size="md" showLabel={false} className="shrink-0" />
          <div>
            <p className="lumen-section-label">
              {topic.grade} класс · {topic.category}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-lumen-graphite sm:text-3xl">
              {topic.title}
            </h1>
            <span className="mt-3 inline-flex rounded-lg bg-lumen-silver-light px-3 py-1 text-xs font-medium text-lumen-graphite-light">
              {TOPIC_STATUS_LABELS.soon}
            </span>
          </div>
        </div>
      </header>

      <section className="lumen-card border-l-4 border-lumen-blue/30 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-lumen-graphite">
          {isGrade6 ? 'Тема 6 класса скоро появится' : 'Тема скоро появится'}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          {isGrade6
            ? 'Эта тема входит в программу 6 класса и появится в ближайших обновлениях. Сейчас можно подготовиться, повторив связанные темы 5 класса.'
            : 'Эта тема скоро появится. Сейчас можно изучить близкие темы.'}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-lumen-graphite-light">
          {topic.description}
        </p>
        {topic.soonHint && (
          <blockquote className="mt-5 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/30 px-4 py-3">
            <p className="text-sm leading-relaxed text-lumen-graphite">{topic.soonHint}</p>
          </blockquote>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-4 text-base font-semibold text-lumen-graphite">
            {isGrade6 ? 'Перед ней полезно повторить' : 'Что можно повторить сейчас'}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/lesson/${rel.slug}`}
                className="lumen-card p-4 transition-all hover:border-lumen-teal/30"
              >
                <p className="font-medium text-lumen-graphite">{rel.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-lumen-graphite-light">
                  {rel.description}
                </p>
                <span className="mt-2 inline-block text-sm font-medium text-lumen-blue">
                  Изучать →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {isGrade6 && (
          <Link to="/map?grade=review" className="lumen-btn-primary text-sm">
            Раздел повторения
          </Link>
        )}
        <Link to={`/topics?grade=${isGrade6 ? 6 : 5}`} className="lumen-btn-secondary text-sm">
          Все темы
        </Link>
        <Link to={`/map?grade=${isGrade6 ? 6 : 5}`} className="lumen-btn-secondary text-sm">
          Карта обучения
        </Link>
      </div>
    </div>
  );
}
