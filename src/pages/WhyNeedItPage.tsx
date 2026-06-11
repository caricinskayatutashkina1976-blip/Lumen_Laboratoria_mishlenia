import { Link, useParams } from 'react-router-dom';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { getWhyNeededByTopicId, getSkillByTopicId } from '../data/lessons';
import { whyNeedItIntro } from '../data/lumen';
import { getTopicBySlug } from '../data/topics';

export function WhyNeedItPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;
  const reasons = topic ? getWhyNeededByTopicId(topic.id) : [];
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
          <LumenAvatar size="lg" />
          <div>
            <p className="lumen-section-label">Зачем мне это нужно?</p>
            <h1 className="mt-2 text-2xl font-bold text-lumen-graphite sm:text-3xl">
              {topic.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
              {whyNeedItIntro}
            </p>
          </div>
        </div>
      </header>

      <div className="mb-8">
        <LumenAssistant
          greeting="Учёба нужна не только для оценок. Она тренирует мышление."
          showAvatar={false}
        />
      </div>

      <section className="mb-8 space-y-4">
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

      <section className="mb-10 lumen-card border-lumen-teal/20 p-6">
        <p className="lumen-section-label">Навык, который ты тренируешь</p>
        <p className="mt-2 font-medium text-lumen-graphite">{skill}</p>
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
