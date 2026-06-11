import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { NextStepRecommendation } from '../components/NextStepRecommendation/NextStepRecommendation';
import { LessonExplanationSections } from '../components/LessonExplanationSections/LessonExplanationSections';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { ProblemList } from '../components/ProblemList/ProblemList';
import { VisualExplanationCard } from '../components/VisualExplanationCard/VisualExplanationCard';
import { WhyNeedItCard } from '../components/WhyNeedItCard/WhyNeedItCard';
import { useProgress } from '../context/ProgressContext';
import { getLessonByTopicId, getSkillByTopicId } from '../data/lessons';
import { getLumenMessage } from '../data/lumenMessages';
import { getTotalErrorCount } from '../data/recommendations';
import { getProblemsByTopicId } from '../data/problems';
import { getTopicBySlug } from '../data/topics';

export function LessonPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();
  const {
    selectTopic,
    completeLesson,
    getTopicProgress,
    isTopicUnlocked,
    getLumenRecommendation,
    progress,
  } = useProgress();

  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;
  const lesson = topic ? getLessonByTopicId(topic.id) : undefined;
  const problems = topic ? getProblemsByTopicId(topic.id) : [];
  const topicProgress = topic ? getTopicProgress(topic.id) : 0;
  const unlocked = topic ? isTopicUnlocked(topic.id) : false;
  const showTrainingRecommendation = getTotalErrorCount(progress.errorStats) > 0;

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
          <LumenAvatar size="lg" showLabel={false} className="shrink-0" />
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
                Прогресс: {topicProgress}%
              </span>
              <span className="rounded-lg bg-lumen-bg px-3 py-1 text-xs font-medium text-lumen-graphite-light">
                Задач: {problems.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-8 space-y-6">
        <LumenAssistant
          greeting={getLumenMessage('topic-start')}
          showWhyButton
          onWhyClick={() => navigate(`/why/${topic.slug}`)}
          showAvatar={false}
          topicId={topic.id}
        />
        <WhyNeedItCard topicId={topic.id} topicTitle={topic.title} topicSlug={topic.slug} />
      </div>

      <section className="mb-8">
        <h2 className="mb-5 text-lg font-semibold text-lumen-graphite sm:text-xl">
          Объяснение темы
        </h2>
        <LessonExplanationSections explanation={lesson.explanation} />
      </section>

      <section className="mb-8">
        <VisualExplanationCard topicId={topic.id} />
      </section>

      <section className="mb-8 lumen-card border-lumen-teal/20 p-5 sm:p-6">
        <p className="lumen-section-label">Навык, который ты тренируешь</p>
        <p className="mt-2 text-base font-medium text-lumen-graphite">
          {getSkillByTopicId(topic.id)}
        </p>
      </section>

      {showTrainingRecommendation && (
        <section className="mb-8">
          <NextStepRecommendation
            recommendation={getLumenRecommendation('lesson', { topicSlug: topic.slug })}
          />
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-lumen-graphite">
          Тренировочные задачи
        </h2>
        <ProblemList problems={problems} progress={progress} topicId={topic.id} />
      </section>
    </div>
  );
}
