import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { HomeworkType } from '../../data/homeworkAnalyzer';
import {
  evaluateHomeworkStepAnswer,
  getConfusedMessage,
  getStepHint,
  getStepQuestion,
  getStepSimple,
  HOMEWORK_STEP_TITLES,
} from '../../data/homeworkSteps';
import {
  clearHomeworkDraft,
  saveHomeworkDraft,
  type HomeworkDraft,
} from '../../utils/homeworkStorage';

interface HomeworkStepSolverProps {
  condition: string;
  type: HomeworkType;
  typeLabel: string;
  initialDraft?: HomeworkDraft | null;
  onComplete: (answers: Record<number, string>) => void;
}

export function HomeworkStepSolver({
  condition,
  type,
  typeLabel,
  initialDraft,
  onComplete,
}: HomeworkStepSolverProps) {
  const [activeStep, setActiveStep] = useState(initialDraft?.activeStep ?? 0);
  const [stepAnswers, setStepAnswers] = useState<Record<number, string>>(
    initialDraft?.stepAnswers ?? {},
  );
  const [currentInput, setCurrentInput] = useState(
    initialDraft?.currentInput ??
      initialDraft?.stepAnswers[initialDraft.activeStep ?? 0] ??
      '',
  );
  const [feedback, setFeedback] = useState('');
  const [checkState, setCheckState] = useState<'idle' | 'accepted' | 'rejected'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [showSimple, setShowSimple] = useState(false);

  const totalSteps = HOMEWORK_STEP_TITLES.length;
  const allDone = activeStep >= totalSteps;

  useEffect(() => {
    if (allDone) return;
    saveHomeworkDraft({
      condition,
      type,
      activeStep,
      stepAnswers,
      currentInput,
      completed: false,
      savedAt: new Date().toISOString(),
    });
  }, [condition, type, activeStep, stepAnswers, currentInput, allDone]);

  function persistAnswer(step: number, value: string) {
    setStepAnswers((prev) => ({ ...prev, [step]: value }));
  }

  function handleCheck() {
    const evaluation = evaluateHomeworkStepAnswer(currentInput, activeStep);
    setFeedback(evaluation.message);
    setShowHint(false);
    setShowSimple(false);

    if (evaluation.result === 'accepted') {
      setCheckState('accepted');
      persistAnswer(activeStep, currentInput.trim());
    } else {
      setCheckState('rejected');
    }
  }

  function handleNext() {
    const nextStep = activeStep + 1;
    if (nextStep >= totalSteps) {
      const finalAnswers = { ...stepAnswers, [activeStep]: currentInput.trim() };
      saveHomeworkDraft({
        condition,
        type,
        activeStep: totalSteps,
        stepAnswers: finalAnswers,
        completed: true,
        savedAt: new Date().toISOString(),
      });
      clearHomeworkDraft();
      onComplete(finalAnswers);
      return;
    }

    setActiveStep(nextStep);
    setCurrentInput(stepAnswers[nextStep] ?? '');
    setFeedback('');
    setCheckState('idle');
    setShowHint(false);
    setShowSimple(false);
  }

  function handleConfused() {
    setShowSimple(true);
    setShowHint(false);
    setFeedback(getConfusedMessage(activeStep));
    setCheckState('idle');
  }

  function handleShowHint() {
    setShowHint(true);
    setShowSimple(false);
    setFeedback(getStepHint(type, activeStep));
  }

  function handleShowSimple() {
    setShowSimple(true);
    setShowHint(false);
    setFeedback(getStepSimple(type, activeStep));
  }

  if (allDone) return null;

  return (
    <section className="space-y-6">
      <div className="lumen-card overflow-hidden border-l-4 border-lumen-teal p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">Тип задачи</p>
        <p className="mt-2 text-lg font-semibold text-lumen-graphite">{typeLabel}</p>
      </div>

      <div className="mb-2">
        <div className="mb-1.5 flex justify-between text-xs text-lumen-silver">
          <span>Шаг {activeStep + 1} из {totalSteps}</span>
          <span>{HOMEWORK_STEP_TITLES[activeStep]}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-lumen-silver-light">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal transition-all duration-500"
            style={{ width: `${((activeStep + (checkState === 'accepted' ? 1 : 0)) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {activeStep > 0 && (
        <div className="space-y-2">
          {HOMEWORK_STEP_TITLES.slice(0, activeStep).map((title, index) => (
            <div
              key={title}
              className="flex items-center gap-2 rounded-lg border border-lumen-teal/20 bg-lumen-teal-soft/20 px-3 py-2"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lumen-teal text-xs font-semibold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-lumen-teal">{title}</p>
                <p className="truncate text-sm text-lumen-graphite-light">
                  {stepAnswers[index]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <article className="lumen-card border-l-4 border-lumen-blue/30 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lumen-blue-soft text-sm font-semibold text-lumen-blue">
            {activeStep + 1}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-lumen-graphite">
              {HOMEWORK_STEP_TITLES[activeStep]}
            </h3>
            <p className="mt-3 text-sm font-medium text-lumen-graphite">
              {getStepQuestion(type, activeStep)}
            </p>

            <textarea
              value={currentInput}
              onChange={(e) => {
                setCurrentInput(e.target.value);
                setCheckState('idle');
                setFeedback('');
              }}
              placeholder="Напиши свой ответ…"
              rows={3}
              className="mt-4 w-full rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3 text-sm text-lumen-graphite outline-none transition-colors focus:border-lumen-teal/50 focus:ring-2 focus:ring-lumen-teal/20"
            />

            {feedback && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 ${
                  checkState === 'accepted'
                    ? 'border-lumen-teal/30 bg-lumen-teal-soft/40'
                    : 'border-lumen-blue/20 bg-lumen-blue-soft/25'
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                  Люмен
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">
                  {feedback}
                </p>
              </div>
            )}

            {(showHint || showSimple) && !feedback && (
              <div className="mt-4 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/25 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                  {showSimple ? 'Объяснение проще' : 'Подсказка'}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">
                  {showSimple
                    ? getStepSimple(type, activeStep)
                    : getStepHint(type, activeStep)}
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={handleCheck} className="lumen-btn-primary text-sm">
                Проверить шаг
              </button>
              <button type="button" onClick={handleShowHint} className="lumen-btn-secondary text-sm">
                Подсказка
              </button>
              <button type="button" onClick={handleShowSimple} className="lumen-btn-secondary text-sm">
                Объясни проще
              </button>
              <button type="button" onClick={handleConfused} className="lumen-btn-secondary text-sm">
                Я совсем не понимаю
              </button>
              {checkState === 'accepted' && (
                <button type="button" onClick={handleNext} className="lumen-btn-accent text-sm">
                  {activeStep < totalSteps - 1 ? 'Следующий шаг' : 'Завершить разбор'}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      <div className="rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3">
        <p className="text-xs font-medium text-lumen-silver">Условие задачи</p>
        <p className="mt-1 text-sm leading-relaxed text-lumen-graphite-light line-clamp-3">
          {condition}
        </p>
      </div>
    </section>
  );
}

interface HomeworkSummaryProps {
  condition: string;
  typeLabel: string;
  answers: Record<number, string>;
  onNewTask?: () => void;
}

export function HomeworkSummary({ condition, typeLabel, answers, onNewTask }: HomeworkSummaryProps) {
  return (
    <section className="lumen-card overflow-hidden border-l-4 border-lumen-teal p-5 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
        Разбор завершён
      </p>
      <h2 className="mt-2 text-xl font-bold text-lumen-graphite sm:text-2xl">
        Ты не просто получил ответ. Ты разобрал задачу по шагам.
      </h2>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3">
          <p className="text-xs font-medium text-lumen-silver">Тип задачи</p>
          <p className="mt-1 text-sm text-lumen-graphite">{typeLabel}</p>
        </div>

        <div className="rounded-xl border border-lumen-blue/20 bg-lumen-blue-soft/20 px-4 py-3">
          <p className="text-xs font-medium text-lumen-blue">Что было известно</p>
          <p className="mt-1 text-sm leading-relaxed text-lumen-graphite-light">
            {answers[1] || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/25 px-4 py-3">
          <p className="text-xs font-medium text-lumen-teal">Что нужно было найти</p>
          <p className="mt-1 text-sm leading-relaxed text-lumen-graphite-light">
            {answers[2] || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3">
          <p className="text-xs font-medium text-lumen-silver">Какое действие выбрано</p>
          <p className="mt-1 text-sm leading-relaxed text-lumen-graphite-light">
            {answers[4] || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-lumen-graphite/10 bg-lumen-surface px-4 py-3">
          <p className="text-xs font-medium text-lumen-graphite">Твой ответ / решение</p>
          <p className="mt-1 text-sm leading-relaxed text-lumen-graphite-light">
            {answers[5] || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-lumen-teal/15 bg-lumen-teal-soft/20 px-4 py-3">
          <p className="text-xs font-medium text-lumen-teal">Проверка</p>
          <p className="mt-1 text-sm leading-relaxed text-lumen-graphite-light">
            {answers[6] || '—'}
          </p>
          <p className="mt-2 text-sm text-lumen-graphite-light">
            Напоминание: всегда спрашивай себя — похож ли ответ на правду? Можно ли проверить
            другим способом?
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-lumen-silver-light bg-lumen-bg px-4 py-3">
          <p className="text-xs font-medium text-lumen-silver">Условие</p>
          <p className="mt-1 text-sm leading-relaxed text-lumen-graphite-light">{condition}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/map" className="lumen-btn-primary text-sm">
          Закрепить на задаче
        </Link>
        {onNewTask ? (
          <button type="button" onClick={onNewTask} className="lumen-btn-secondary text-sm">
            Разобрать другую задачу
          </button>
        ) : (
          <Link to="/homework" className="lumen-btn-secondary text-sm">
            Разобрать другую задачу
          </Link>
        )}
      </div>
    </section>
  );
}
