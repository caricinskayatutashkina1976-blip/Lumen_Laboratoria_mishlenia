import { useState } from 'react';
import type { ProblemStep } from '../../types';
import { getLumenMessage } from '../../data/lumenMessages';

interface ProblemStepSolverProps {
  steps: ProblemStep[];
  onStepComplete?: (stepId: number) => void;
  onAllComplete?: () => void;
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function checkAnswer(input: string, expected?: string): boolean {
  if (!expected) return input.trim().length >= 2;
  const normalized = normalizeAnswer(input);
  const expectedNorm = normalizeAnswer(expected);
  return (
    normalized === expectedNorm ||
    normalized.includes(expectedNorm) ||
    expectedNorm.includes(normalized)
  );
}

export function ProblemStepSolver({
  steps: initialSteps,
  onStepComplete,
  onAllComplete,
}: ProblemStepSolverProps) {
  const [steps, setSteps] = useState(initialSteps);
  const [activeStep, setActiveStep] = useState(0);
  const [maxUnlocked, setMaxUnlocked] = useState(0);
  const [showLumenHint, setShowLumenHint] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [lumenFeedback, setLumenFeedback] = useState('');

  const currentStep = steps[activeStep];
  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;

  function resetStepState() {
    setShowLumenHint(false);
    setShowSimple(false);
    setStudentAnswer('');
    setSelectedOption(null);
    setCheckResult('idle');
    setLumenFeedback('');
  }

  function goToStep(index: number) {
    if (index <= maxUnlocked) {
      setActiveStep(index);
      resetStepState();
    }
  }

  function handleCheckStep() {
    if (!currentStep) return;

    const answer = currentStep.answerOptions
      ? selectedOption ?? ''
      : studentAnswer;

    if (!answer.trim()) {
      setLumenFeedback(getLumenMessage('hint-request'));
      return;
    }

    const isCorrect = currentStep.answerOptions
      ? selectedOption === currentStep.expectedAnswer ||
        checkAnswer(selectedOption ?? '', currentStep.expectedAnswer)
      : checkAnswer(studentAnswer, currentStep.expectedAnswer);

    if (isCorrect) {
      setCheckResult('correct');
      setLumenFeedback(getLumenMessage('correct-answer'));
    } else {
      setCheckResult('wrong');
      setLumenFeedback(getLumenMessage('wrong-answer'));
    }
  }

  function handleStepComplete() {
    if (!currentStep) return;

    setSteps((prev) =>
      prev.map((s) => (s.id === currentStep.id ? { ...s, completed: true } : s)),
    );
    onStepComplete?.(currentStep.id);
    setLumenFeedback(getLumenMessage('step-complete'));

    const nextUnlocked = Math.min(activeStep + 1, steps.length - 1);
    setMaxUnlocked((prev) => Math.max(prev, nextUnlocked));

    if (activeStep === steps.length - 1) {
      onAllComplete?.();
    } else {
      setTimeout(() => {
        setActiveStep(activeStep + 1);
        resetStepState();
      }, 600);
    }
  }

  function handleNotUnderstood() {
    setShowSimple(true);
    setLumenFeedback(getLumenMessage('not-understood'));
  }

  if (!currentStep) return null;

  const canProceed =
    checkResult === 'correct' || (!currentStep.expectedAnswer && studentAnswer.trim().length >= 2);

  return (
    <section className="lumen-card overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue to-lumen-teal" />
      <div className="border-b border-lumen-silver-light px-4 py-4 sm:px-6 sm:py-5">
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
            <span>{completedCount} / {steps.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-lumen-silver-light">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal transition-all duration-500"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
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
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all lg:w-full ${
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
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
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
                  className={`text-xs font-medium sm:text-sm ${
                    isActive ? 'text-lumen-graphite' : 'text-lumen-graphite-light'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
              {currentStep.completed ? 'Пройдено' : 'Текущий шаг'}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-lumen-graphite sm:text-xl">
              {currentStep.title}
            </h3>
          </div>

          <div className="rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-lumen-silver">
              Зачем этот шаг
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">
              {currentStep.whyNeeded}
            </p>
          </div>

          {!showSimple && (
            <div className="rounded-xl border border-lumen-blue/20 bg-lumen-blue-soft/30 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
                Разбор
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
                {currentStep.content}
              </p>
            </div>
          )}

          {showSimple && (
            <div className="rounded-xl border border-lumen-teal/30 bg-lumen-teal-soft/40 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                Объяснение проще
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
                {currentStep.simpleExplanation}
              </p>
            </div>
          )}

          {!currentStep.completed && (
            <>
              <div className="rounded-xl border border-lumen-graphite/10 bg-lumen-surface px-4 py-4">
                <p className="text-sm font-medium text-lumen-graphite">
                  {currentStep.question}
                </p>

                {currentStep.answerOptions ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentStep.answerOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedOption(option);
                          setCheckResult('idle');
                        }}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                          selectedOption === option
                            ? 'border-lumen-blue bg-lumen-blue-soft text-lumen-blue'
                            : 'border-lumen-silver-light bg-lumen-bg text-lumen-graphite-light hover:border-lumen-teal/40'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={studentAnswer}
                    onChange={(e) => {
                      setStudentAnswer(e.target.value);
                      setCheckResult('idle');
                    }}
                    placeholder="Запиши свой ответ..."
                    className="mt-3 w-full rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3 text-sm text-lumen-graphite outline-none transition-colors focus:border-lumen-teal/50 focus:ring-2 focus:ring-lumen-teal/20"
                  />
                )}
              </div>

              {showLumenHint && (
                <div className="rounded-xl border border-lumen-teal/25 bg-lumen-teal-soft/30 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                    Подсказка от Люмена
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">
                    {currentStep.lumenHint}
                  </p>
                </div>
              )}

              {lumenFeedback && (
                <div
                  className={`rounded-xl border px-4 py-3 ${
                    checkResult === 'correct'
                      ? 'border-lumen-teal/30 bg-lumen-teal-soft/40'
                      : checkResult === 'wrong'
                        ? 'border-lumen-blue/25 bg-lumen-blue-soft/30'
                        : 'border-lumen-silver-light bg-lumen-bg'
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                    Люмен
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">
                    {lumenFeedback}
                  </p>
                </div>
              )}

              {checkResult === 'correct' && (
                <div className="rounded-xl border border-lumen-teal/30 bg-lumen-teal-soft/30 px-4 py-3">
                  <p className="text-sm text-lumen-graphite-light">{currentStep.content}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowLumenHint(true)}
                  className="lumen-btn-secondary text-sm"
                >
                  Подсказка от Люмена
                </button>
                <button
                  type="button"
                  onClick={handleCheckStep}
                  className="lumen-btn-primary text-sm"
                >
                  Проверить шаг
                </button>
                <button
                  type="button"
                  onClick={handleNotUnderstood}
                  className="lumen-btn-secondary text-sm"
                >
                  Я всё равно не понял
                </button>
                {canProceed && (
                  <button
                    type="button"
                    onClick={handleStepComplete}
                    className="lumen-btn-accent text-sm"
                  >
                    {activeStep < steps.length - 1 ? 'Следующий шаг' : 'Завершить'}
                  </button>
                )}
              </div>
            </>
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
                {getLumenMessage('problem-complete')}
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
