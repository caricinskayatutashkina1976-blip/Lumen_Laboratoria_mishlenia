import { useState } from 'react';
import type { ProblemStep } from '../../types';

interface ProblemStepSolverProps {
  steps: ProblemStep[];
  onStepComplete?: (stepId: number) => void;
  onAllComplete?: () => void;
}

export function ProblemStepSolver({
  steps: initialSteps,
  onStepComplete,
  onAllComplete,
}: ProblemStepSolverProps) {
  const [steps, setSteps] = useState(initialSteps);
  const [activeStep, setActiveStep] = useState(0);
  const [maxUnlocked, setMaxUnlocked] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [useSimple, setUseSimple] = useState(false);

  const currentStep = steps[activeStep];
  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;

  function resetStepView() {
    setShowHint(false);
    setShowExplanation(false);
    setUseSimple(false);
  }

  function goToStep(index: number) {
    if (index <= maxUnlocked) {
      setActiveStep(index);
      resetStepView();
    }
  }

  function handleShowHint() {
    setShowHint(true);
  }

  function handleExplainSimpler() {
    setShowExplanation(true);
    setUseSimple(true);
  }

  function handleUnderstood() {
    if (!currentStep) return;

    setSteps((prev) =>
      prev.map((s) => (s.id === currentStep.id ? { ...s, completed: true } : s)),
    );
    onStepComplete?.(currentStep.id);

    const nextUnlocked = Math.min(activeStep + 1, steps.length - 1);
    setMaxUnlocked((prev) => Math.max(prev, nextUnlocked));

    if (activeStep === steps.length - 1) {
      onAllComplete?.();
    } else {
      setActiveStep(activeStep + 1);
      resetStepView();
    }
  }

  function handleNextStep() {
    if (activeStep < maxUnlocked) {
      setActiveStep(activeStep + 1);
      resetStepView();
    } else if (showExplanation || showHint) {
      setShowExplanation(true);
      if (!useSimple) setUseSimple(false);
    }
  }

  if (!currentStep) return null;

  const explanationText = useSimple
    ? currentStep.simpleExplanation
    : currentStep.content;

  return (
    <section className="lumen-card overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue to-lumen-teal" />
      <div className="border-b border-lumen-silver-light px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
              Пошаговый разбор
            </p>
            <h2 className="mt-1 text-lg font-semibold text-lumen-graphite">
              Разбираем задачу вместе
            </h2>
          </div>
          <div className="rounded-lg bg-lumen-bg px-3 py-1.5 text-sm text-lumen-silver">
            Шаг {activeStep + 1} из {steps.length}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-lumen-silver">
            <span>Пройдено шагов</span>
            <span>
              {completedCount} / {steps.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-lumen-silver-light">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal transition-all duration-500"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[260px_1fr]">
        <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isDone = step.completed;
            const isLocked = index > maxUnlocked;

            return (
              <button
                key={step.id}
                type="button"
                disabled={isLocked}
                onClick={() => goToStep(index)}
                className={`flex shrink-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all lg:w-full ${
                  isLocked
                    ? 'cursor-not-allowed border-lumen-silver-light/50 bg-lumen-bg/50 opacity-50'
                    : isActive
                      ? 'border-lumen-blue/40 bg-lumen-blue-soft shadow-sm'
                      : isDone
                        ? 'border-lumen-teal/25 bg-lumen-teal-soft/30'
                        : 'border-lumen-silver-light bg-lumen-bg hover:border-lumen-silver'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                    isDone
                      ? 'bg-lumen-teal text-white'
                      : isActive
                        ? 'bg-lumen-blue text-white'
                        : 'bg-lumen-silver-light text-lumen-graphite-light'
                  }`}
                >
                  {step.id}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isActive ? 'text-lumen-graphite' : 'text-lumen-graphite-light'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
              {currentStep.completed ? 'Пройдено' : 'Текущий шаг'}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-lumen-graphite">
              {currentStep.title}
            </h3>
          </div>

          {!showHint && !showExplanation && !currentStep.completed && (
            <div className="rounded-xl border border-dashed border-lumen-silver-light bg-lumen-bg/80 px-5 py-8 text-center">
              <p className="text-sm text-lumen-graphite-light">
                Прочитай название шага и подумай сам. Если нужна помощь — нажми
                «Показать подсказку» или «Объясни проще».
              </p>
            </div>
          )}

          {showHint && (
            <div className="rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-lumen-silver">
                Подсказка
              </p>
              <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light">
                {currentStep.hint}
              </p>
            </div>
          )}

          {showExplanation && (
            <div className="rounded-xl border border-lumen-blue/25 bg-lumen-blue-soft/40 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
                {useSimple ? 'Объяснение проще' : 'Разбор'}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
                {explanationText}
              </p>
            </div>
          )}

          {!currentStep.completed && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleShowHint} className="lumen-btn-secondary">
                Показать подсказку
              </button>
              <button type="button" onClick={handleExplainSimpler} className="lumen-btn-secondary">
                Объясни проще
              </button>
              {(showHint || showExplanation) && (
                <>
                  <button type="button" onClick={handleUnderstood} className="lumen-btn-primary">
                    Я понял
                  </button>
                  {activeStep < steps.length - 1 && (
                    <button type="button" onClick={handleNextStep} className="lumen-btn-accent">
                      Следующий шаг
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {currentStep.completed && activeStep < steps.length - 1 && (
            <button
              type="button"
              onClick={() => goToStep(activeStep + 1)}
              className="lumen-btn-accent"
            >
              Следующий шаг
            </button>
          )}

          {allDone && (
            <div className="rounded-xl border border-lumen-teal/30 bg-lumen-teal-soft/50 px-5 py-4">
              <p className="font-medium text-lumen-graphite">
                Ты не просто получил ответ. Ты понял ход решения.
              </p>
              <p className="mt-1 text-sm text-lumen-graphite-light">
                Понимаю, а не заучиваю — так и работает настоящее обучение.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
