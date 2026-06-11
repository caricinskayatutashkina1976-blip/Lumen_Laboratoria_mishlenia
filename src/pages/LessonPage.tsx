import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { WhyNeedItCard } from '../components/WhyNeedItCard/WhyNeedItCard';
import { useProgress } from '../context/ProgressContext';
import { getLessonByTopicId, getSkillByTopicId } from '../data/lessons';
import { getProblemsByTopicId } from '../data/problems';
import { getTopicBySlug } from '../data/topics';

export function LessonPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();
  const { selectTopic, completeLesson, getTopicProgress, isTopicUnlocked } = useProgress();

  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;
  const lesson = topic ? getLessonByTopicId(topic.id) : undefined;
  const problems = topic ? getProblemsByTopicId(topic.id) : [];
  const progress = topic ? getTopicProgress(topic.id) : 0;
  const unlocked = topic ? isTopicUnlocked(topic.id) : false;

  useEffect(() => {
    if (topic && lesson) {
      selectTopic(topic.id);
      completeLesson(lesson.id, topic.id);
    }
  }, [topic, lesson, selectTopic, completeLesson]);

  if (!topic || !lesson) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-lumen-graphite">Тема не найдена</h1>
        <Link to="/topics" className="mt-4 inline-block text-lumen-blue hover:underline">
          Вернуться к темам
        </Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-lumen-graphite">Тема пока закрыта</h1>
        <p className="mt-2 text-sm text-lumen-graphite-light">
          Продвинься по предыдущей теме — эта откроется автоматически.
        </p>
        <Link to="/map" className="mt-4 inline-block text-lumen-blue hover:underline">
          Карта тем
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link to="/map" className="text-sm text-lumen-silver transition-colors hover:text-lumen-blue">
        ← К карте тем
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <LumenAvatar size="lg" className="shrink-0" />
          <div>
            <p className="lumen-section-label">{topic.title}</p>
            <h1 className="mt-2 text-2xl font-bold text-lumen-graphite sm:text-3xl">
              {lesson.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
              {lesson.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-lg bg-lumen-blue-soft px-3 py-1 text-xs font-medium text-lumen-blue">
                Сложность: {topic.difficulty}
              </span>
              <span className="rounded-lg bg-lumen-teal-soft px-3 py-1 text-xs font-medium text-lumen-teal">
                Прогресс: {progress}%
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-8 space-y-6">
        <LumenAssistant
          greeting="Сначала разберём идею простыми словами. Если что-то непонятно — нажми кнопку ниже."
          showWhyButton
          onWhyClick={() => navigate(`/why/${topic.slug}`)}
          showAvatar={false}
        />
        <WhyNeedItCard topicId={topic.id} topicTitle={topic.title} topicSlug={topic.slug} />
      </div>

      <section className="mb-8 lumen-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-lumen-graphite">Объяснение темы</h2>
        <ul className="mt-5 space-y-4">
          {lesson.content.map((paragraph, index) => (
            <li
              key={index}
              className="flex gap-4 text-sm leading-relaxed text-lumen-graphite-light sm:text-base"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lumen-teal-soft text-xs font-semibold text-lumen-teal">
                {index + 1}
              </span>
              {paragraph}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 lumen-card border-lumen-teal/20 p-6 sm:p-8">
        <p className="lumen-section-label">Навык, который ты тренируешь</p>
        <p className="mt-2 text-base font-medium text-lumen-graphite">
          {getSkillByTopicId(topic.id)}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-lumen-graphite">
          Тренировочные задачи
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="lumen-card group p-5 transition-all hover:border-lumen-blue/30"
            >
              <p className="text-xs text-lumen-silver">{problem.difficulty}</p>
              <h3 className="mt-1 font-medium text-lumen-graphite group-hover:text-lumen-blue">
                {problem.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-lumen-graphite-light">
                {problem.condition}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-lumen-blue">
                Разобрать →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
