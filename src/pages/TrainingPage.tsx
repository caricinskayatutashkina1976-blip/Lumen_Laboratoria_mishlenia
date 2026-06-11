import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { NextStepRecommendation } from '../components/NextStepRecommendation/NextStepRecommendation';
import { useProgress } from '../context/ProgressContext';
import { getAdaptiveRecommendation } from '../data/recommendations';
import { getTrainingBySkill, isValidTrainingSkill } from '../data/trainings';

export function TrainingPage() {
  const { skill } = useParams<{ skill: string }>();
  const { completeTraining, progress } = useProgress();
  const training = skill && isValidTrainingSkill(skill) ? getTrainingBySkill(skill) : undefined;

  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!training) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-lumen-graphite">Тренировка не найдена</h1>
        <Link to="/profile" className="mt-4 inline-block text-lumen-blue hover:underline">
          В профиль
        </Link>
      </div>
    );
  }

  const exercise = training.exercises[activeIndex];
  const isLast = activeIndex === training.exercises.length - 1;
  const isCorrect = selected === exercise.correctAnswer;

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    if (selected === exercise.correctAnswer) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      completeTraining(training.id, correctCount);
      setFinished(true);
    } else {
      setActiveIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  const postRecommendation = getAdaptiveRecommendation(progress.errorStats, 'after-problem');

  if (finished) {
    const passed = correctCount >= 2;
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to="/profile" className="text-sm text-lumen-silver hover:text-lumen-blue">
          ← К профилю
        </Link>

        <section className="lumen-card mt-6 border-l-4 border-lumen-teal p-6 sm:p-8">
          <p className="lumen-section-label">Тренировка завершена</p>
          <h1 className="mt-2 text-2xl font-bold text-lumen-graphite">{training.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
            {passed
              ? `Отлично. Верных ответов: ${correctCount} из ${training.exercises.length}. Навык укреплён.`
              : `Верных ответов: ${correctCount} из ${training.exercises.length}. Можно пройти ещё раз — без спешки.`}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to={`/training/${training.id}`} className="lumen-btn-secondary text-sm">
              Пройти ещё раз
            </Link>
            <Link to="/map" className="lumen-btn-primary text-sm">
              К карте тем
            </Link>
          </div>
        </section>

        <div className="mt-8">
          <NextStepRecommendation recommendation={postRecommendation} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link to="/profile" className="text-sm text-lumen-silver hover:text-lumen-blue">
        ← К профилю
      </Link>

      <header className="mt-4 mb-6">
        <p className="lumen-section-label">Мини-тренировка</p>
        <h1 className="mt-2 text-2xl font-bold text-lumen-graphite sm:text-3xl">
          {training.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          {training.intro}
        </p>
      </header>

      <div className="mb-6">
        <div className="mb-1.5 flex justify-between text-xs text-lumen-silver">
          <span>Задание {activeIndex + 1} из {training.exercises.length}</span>
          <span>Верно: {correctCount}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-lumen-silver-light">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal transition-all"
            style={{ width: `${((activeIndex + (checked ? 1 : 0)) / training.exercises.length) * 100}%` }}
          />
        </div>
      </div>

      <section className="lumen-card p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-silver">Условие</p>
        <p className="mt-2 text-sm leading-relaxed text-lumen-graphite sm:text-base">
          {exercise.condition}
        </p>

        <p className="mt-5 text-sm font-medium text-lumen-graphite">{exercise.question}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {exercise.options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={checked}
              onClick={() => setSelected(option)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                selected === option
                  ? 'border-lumen-blue bg-lumen-blue-soft text-lumen-blue'
                  : 'border-lumen-silver-light bg-lumen-bg text-lumen-graphite-light hover:border-lumen-teal/40'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {checked && (
          <div
            className={`mt-5 rounded-xl border px-4 py-3 ${
              isCorrect
                ? 'border-lumen-teal/30 bg-lumen-teal-soft/40'
                : 'border-lumen-blue/20 bg-lumen-blue-soft/25'
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">Люмен</p>
            <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">
              {isCorrect
                ? exercise.explanation
                : `Пока не сходится. ${exercise.explanation}`}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {!checked && (
            <button
              type="button"
              onClick={handleCheck}
              disabled={!selected}
              className="lumen-btn-primary text-sm disabled:opacity-50"
            >
              Проверить
            </button>
          )}
          {checked && (
            <button type="button" onClick={handleNext} className="lumen-btn-accent text-sm">
              {isLast ? 'Завершить тренировку' : 'Следующее задание'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
