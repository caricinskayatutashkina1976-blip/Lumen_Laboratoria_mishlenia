import { Link, useParams } from 'react-router-dom';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import {
  getSkillByTopicId,
  getWhyNeededByTopicId,
  getWhyNeededDetailsByTopicId,
} from '../data/lessons';
import { getTopicBySlug } from '../data/topics';

export function WhyNeedItPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;
  const reasons = topic ? getWhyNeededByTopicId(topic.id) : [];
  const details = topic ? getWhyNeededDetailsByTopicId(topic.id) : null;
  const skill = topic ? getSkillByTopicId(topic.id) : '';

  if (!topic) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-lumen-graphite">Тема не найдена</h1>
        <Link to="/topics" className="mt-4 inline-block text-lumen-blue hover:underline">
          Вернуться к темам
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to={`/lesson/${topic.slug}`}
        className="text-sm text-lumen-silver transition-colors hover:text-lumen-blue"
      >
        ← К уроку
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <LumenAvatar size="lg" showLabel={false} />
          <div>
            <p className="lumen-section-label">Зачем мне это нужно?</p>
            <h1 className="mt-2 text-2xl font-bold text-lumen-graphite sm:text-3xl">
              {topic.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
              Математика помогает понимать мир и принимать решения. Вот где эта тема пригодится.
            </p>
          </div>
        </div>
      </header>

      <div className="mb-8">
        <LumenAssistant
          greeting="Эта тема связана с реальной жизнью. Посмотри, где она может пригодиться."
          showAvatar={false}
          topicId={topic.id}
        />
      </div>

      {details && (
        <section className="mb-8 lumen-card border-l-4 border-lumen-blue p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-lumen-blue">
            Где пригодится в жизни
          </h2>
          <ul className="mt-4 space-y-3">
            {details.lifeUse.map((item, index) => (
              <li key={index} className="flex gap-3 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lumen-blue" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-8 lumen-card border-l-4 border-lumen-teal p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-lumen-teal">
          Какой навык тренирует
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          {skill}
        </p>
      </section>

      {details && (
        <section className="mb-8 lumen-card border-l-4 border-lumen-graphite/20 p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-lumen-graphite">
            Связь с технологиями и будущим
          </h2>
          <ul className="mt-4 space-y-3">
            {details.futureConnections.map((item, index) => (
              <li key={index} className="flex gap-3 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lumen-teal" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-10 space-y-4">
        <h2 className="text-base font-semibold text-lumen-graphite">Ещё примеры</h2>
        {reasons.map((reason, index) => (
          <article key={index} className="lumen-card flex gap-4 p-5 sm:p-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lumen-blue-soft text-sm font-semibold text-lumen-blue">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
              {reason}
            </p>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to={`/lesson/${topic.slug}`} className="lumen-btn-primary">
          Вернуться к уроку
        </Link>
        <Link to="/map" className="lumen-btn-secondary">
          Карта тем
        </Link>
      </div>
    </div>
  );
}
