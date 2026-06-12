import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { ProblemOfDay } from '../components/ProblemOfDay/ProblemOfDay';
import { TodayMission } from '../components/TodayMission/TodayMission';
import { useProgress } from '../context/ProgressContext';
import { CurriculumPath } from '../components/CurriculumPath/CurriculumPath';
import { GradeSwitcher } from '../components/GradeSwitcher/GradeSwitcher';
import {
  activeTopicIdsGrade5,
  activeTopicIdsGrade6,
  getTopicsByGrade,
  reviewTopicIds,
  topics,
} from '../data/topics';
import type { Grade } from '../types';
import { gradeViewToParam } from '../data/grades';

const quickTopics = [
  { slug: 'text-problems', label: 'Текстовые задачи' },
  { slug: 'fractions', label: 'Дроби' },
  { slug: 'percents', label: 'Проценты' },
  { slug: 'motion', label: 'Задачи на движение' },
  { slug: 'area-perimeter', label: 'Площадь и периметр' },
];

export function HomePage() {
  const { getDailyProblem, ensureDailyProblem } = useProgress();
  const dailyProblem = getDailyProblem();
  const [gradeView, setGradeView] = useState<Grade>(5);

  useEffect(() => {
    ensureDailyProblem();
  }, [ensureDailyProblem]);

  const grade5Count = activeTopicIdsGrade5.length;
  const grade6Count = activeTopicIdsGrade6.length;
  const reviewCount = reviewTopicIds.length;
  const grade6Total = getTopicsByGrade(6).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="mb-10">
        <div className="lumen-card overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-teal via-lumen-blue to-lumen-teal" />
          <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <p className="lumen-section-label">Образовательная платформа</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-lumen-graphite sm:text-4xl lg:text-5xl">
                Люмен. Лаборатория решений
              </h1>
              <p className="mt-3 text-lg text-lumen-blue sm:text-xl">
                AI-наставник по математике для 5–6 класса
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base lg:mx-0">
                Люмен объясняет сложные темы простыми словами, показывает схемы и
                помогает разбирать задачи по шагам.
              </p>

              <blockquote className="mx-auto mt-6 max-w-xl border-l-4 border-lumen-teal bg-lumen-teal-soft/50 px-5 py-4 text-left lg:mx-0">
                <p className="text-base font-medium leading-relaxed text-lumen-graphite sm:text-lg">
                  «Привет. Я Люмен. Давай разбираться спокойно и по шагам.»
                </p>
              </blockquote>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link to="/map" className="lumen-btn-primary text-center">
                  Начать обучение
                </Link>
                <Link to="/topics" className="lumen-btn-accent text-center">
                  Я не понял тему
                </Link>
                <Link to="/homework" className="lumen-btn-secondary text-center">
                  Помочь с домашним заданием
                </Link>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <LumenAvatar
                size="hero"
                showLabel={false}
                className="drop-shadow-[0_16px_48px_rgba(30,41,59,0.12)]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8">
        <GradeSwitcher
          value={gradeView}
          onChange={setGradeView}
          label="Что изучаем?"
        />
        {gradeView === 6 && (
          <p className="mt-4 text-sm leading-relaxed text-lumen-graphite-light">
            Раздел 6 класса готовится. Уже можно повторить базу 5 класса.
          </p>
        )}
      </div>

      <div className="mb-8">
        <TodayMission />
      </div>

      <div className="mb-8">
        <ProblemOfDay problem={dailyProblem} />
      </div>

      <div className="mb-10">
        <CurriculumPath compact gradeView={gradeView} />
      </div>

      <div className="mb-10">
        <LumenAssistant
          greeting="Выбери, чем помочь — объясню проще, покажу пример или разберём по шагам."
          compact
          showAvatarLabel={false}
        />
      </div>

      {gradeView === 5 && (
        <section className="mb-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-lumen-graphite sm:text-2xl">
                Выбери тему
              </h2>
              <p className="mt-1 text-sm text-lumen-silver">
                Или открой полную карту обучения
              </p>
            </div>
            <Link to="/map" className="hidden text-sm font-medium text-lumen-blue hover:underline sm:inline">
              Карта тем
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickTopics.map((topic) => (
              <Link
                key={topic.slug}
                to={`/lesson/${topic.slug}`}
                className="lumen-card group flex items-center justify-between px-6 py-5 transition-all hover:border-lumen-teal/30 hover:shadow-[0_12px_40px_rgba(30,41,59,0.1)]"
              >
                <span className="font-medium text-lumen-graphite transition-colors group-hover:text-lumen-blue">
                  {topic.label}
                </span>
                <span className="text-lumen-silver transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}

            <Link
              to="/topics"
              className="group flex items-center justify-between rounded-2xl border border-dashed border-lumen-blue/40 bg-lumen-blue-soft/30 px-6 py-5 transition-all hover:bg-lumen-blue-soft/50 sm:col-span-2 lg:col-span-1"
            >
              <span className="font-medium text-lumen-blue">Я не понял тему</span>
              <span className="text-lumen-blue/60 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>
      )}

      {gradeView === 'review' && (
        <section className="mb-10 lumen-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-lumen-graphite">Повторение перед 6 классом</h2>
          <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light">
            {reviewCount} тем готовы к повторению. Вернись к любой из них, если что-то забылось.
          </p>
          <Link to="/map?grade=review" className="lumen-btn-primary mt-4 inline-flex">
            Открыть раздел повторения
          </Link>
        </section>
      )}

      <section className="lumen-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-lumen-graphite">Все темы платформы</h2>
        <p className="mt-1 text-sm text-lumen-silver">
          {topics.length} тем в программе · 5 класс: {grade5Count} готовы · 6 класс: {grade6Count}{' '}
          из {grade6Total} · повторение: {reviewCount}
        </p>
        <Link
          to={`/map?grade=${gradeViewToParam(gradeView)}`}
          className="lumen-btn-primary mt-4 inline-flex"
        >
          Открыть карту тем
        </Link>
      </section>
    </div>
  );
}
