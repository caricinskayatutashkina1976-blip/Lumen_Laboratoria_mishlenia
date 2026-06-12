import { useState } from 'react';
import type { ErrorDiagnosis, ErrorType, ProblemStep, StepAnswerOption } from '../../types';
import { diagnoseStepError, getDiagnosisForErrorType } from '../../data/errorDiagnosis';
import { ErrorDiagnosisCard } from '../ErrorDiagnosisCard/ErrorDiagnosisCard';
import { getLumenMessage, selfFixSuccessMessage } from '../../data/lumenMessages';
import { evaluateTextAnswer } from '../../utils/answerMatching';
import { getStepTextAnswerFeedback } from '../../data/lumenChatResponses';
import { StudentInputBox } from '../StudentInputBox/StudentInputBox';
import { LumenReply } from '../LumenReply/LumenReply';

interface ProblemStepSolverProps {
  steps: ProblemStep[];
  onStepComplete?: (stepId: number) => void;
  onAllComplete?: () => void;
  onStepError?: (errorType: ErrorType) => void;
  onSelfFix?: (errorType: ErrorType) => void;
  onHintUsed?: () => void;
}

export function ProblemStepSolver({
  steps: initialSteps,
  onStepComplete,
  onAllComplete,
  onStepError,
  onSelfFix,
  onHintUsed,
}: ProblemStepSolverProps) {
  const [steps, setSteps] = useState(initialSteps);
  const [activeStep, setActiveStep] = useState(0);
  const [maxUnlocked, setMaxUnlocked] = useState(0);
  const [showLumenHint, setShowLumenHint] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<'idle' | 'correct' | 'close' | 'wrong'>('idle');
  const [lumenFeedback, setLumenFeedback] = useState('');
  const [diagnosis, setDiagnosis] = useState<ErrorDiagnosis | null>(null);
  const [pendingSelfFix, setPendingSelfFix] = useState<ErrorType | null>(null);

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
    setDiagnosis(null);
  }

  function goToStep(index: number) {
    if (index <= maxUnlocked || pendingSelfFix !== null) {
      setActiveStep(index);
      resetStepState();
      setPendingSelfFix(null);
    }
  }

  function isRushedToSolution(): boolean {
    const earlySteps = steps.filter((s) => s.id <= 3);
    const incompleteEarly = earlySteps.some((s) => !s.completed);
    return incompleteEarly && (currentStep?.id === 5 || currentStep?.id === 6);
  }

  function buildDiagnosis(errorType: ErrorType): ErrorDiagnosis {
    if (isRushedToSolution() && (currentStep?.id === 5 || currentStep?.id === 6)) {
      return getDiagnosisForErrorType('rushed-to-solution');
    }
    return getDiagnosisForErrorType(errorType);
  }

  function handleOptionResult(selected: StepAnswerOption) {
    if (selected.isCorrect) {
      setCheckResult('correct');
      setDiagnosis(null);
      setLumenFeedback(selected.feedback);

      if (pendingSelfFix !== null) {
        onSelfFix?.(pendingSelfFix);
        setLumenFeedback(selfFixSuccessMessage);
        setPendingSelfFix(null);
      }
      return;
    }

    setCheckResult('wrong');
    const errorType = selected.errorType ?? diagnoseStepError(currentStep!.id).type;
    setLumenFeedback(selected.feedback);
    setDiagnosis(buildDiagnosis(errorType));
    onStepError?.(errorType);
  }

  function handleTextResult(
    result: ReturnType<typeof evaluateTextAnswer>['result'],
    message: string,
  ) {
    if (result === 'exact') {
      setCheckResult('correct');
      setDiagnosis(null);
      setLumenFeedback(message);

      if (pendingSelfFix !== null) {
        onSelfFix?.(pendingSelfFix);
        setLumenFeedback(selfFixSuccessMessage);
        setPendingSelfFix(null);
      }
      return;
    }

    if (result === 'close') {
      setCheckResult('close');
      setDiagnosis(null);
      setLumenFeedback(message);
      return;
    }

    setCheckResult('wrong');
    const errorType = diagnoseStepError(currentStep!.id, {
      rushed: isRushedToSolution(),
    }).type;
    setLumenFeedback(message);
    setDiagnosis(buildDiagnosis(errorType));
    onStepError?.(errorType);
  }

  function handleCheckStep() {
    if (!currentStep) return;

    if (currentStep.answerOptions?.length) {
      if (!selectedOption) {
        setLumenFeedback('Выбери один из вариантов и подумай, какой лучше подходит.');
        return;
      }

      const selected = currentStep.answerOptions.find((option) => option.text === selectedOption);
      if (!selected) return;
      handleOptionResult(selected);
      return;
    }

    const trimmed = studentAnswer.trim();
    if (!trimmed) {
      setCheckResult('idle');
      setLumenFeedback(getStepTextAnswerFeedback('', 'empty'));
      return;
    }

    if (trimmed.length < 3) {
      setCheckResult('idle');
      setLumenFeedback(getStepTextAnswerFeedback(trimmed, 'short'));
      return;
    }

    const evaluation = evaluateTextAnswer(
      studentAnswer,
      currentStep.expectedAnswer,
      currentStep.acceptedAnswers,
      currentStep.acceptedKeywords,
    );

    const feedbackText =
      evaluation.result === 'exact' || evaluation.result === 'close'
        ? getStepTextAnswerFeedback(trimmed, evaluation.result)
        : evaluation.result === 'wrong'
          ? getStepTextAnswerFeedback(trimmed, 'wrong')
          : evaluation.message;

    handleTextResult(evaluation.result, feedbackText);
  }

  function handleReturnToStep() {
    if (!diagnosis) return;
    setPendingSelfFix(diagnosis.type);
    setActiveStep(diagnosis.targetStepIndex);
    setShowLumenHint(false);
    setShowSimple(false);
    setStudentAnswer('');
    setSelectedOption(null);
    setCheckResult('idle');
    setDiagnosis(null);
    setLumenFeedback(
      'Давай разберём этот шаг спокойно. Ошибка — это подсказка, какой навык укрепить.',
    );
  }

  function handleExplainSimplerFromDiagnosis() {
    setShowSimple(true);
    if (diagnosis) {
      setLumenFeedback(diagnosis.explanation);
    }
  }

  function handleStepComplete() {
    if (!currentStep) return;

    setSteps((prev) =>
      prev.map((s) => (s.id === currentStep.id ? { ...s, completed: true } : s)),
    );
    onStepComplete?.(currentStep.id);

    if (pendingSelfFix === null) {
      setLumenFeedback(getLumenMessage('step-complete'));
    }

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

  function handleShowHint() {
    setShowLumenHint(true);
    onHintUsed?.();
  }

  if (!currentStep) return null;

  const canProceed =
    checkResult === 'correct' ||
    checkResult === 'close' ||
    (!currentStep.answerOptions?.length &&
      !currentStep.expectedAnswer &&
      studentAnswer.trim().length >= 2);

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
            const isLocked = index > maxUnlocked && pendingSelfFix === null;

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
          {pendingSelfFix && (
            <div className="rounded-xl border border-lumen-teal/25 bg-lumen-teal-soft/30 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                Разбираем ошибку
              </p>
              <p className="mt-1.5 text-sm text-lumen-graphite-light">
                Попробуй ответить на этом шаге ещё раз — спокойно, без спешки.
              </p>
            </div>
          )}

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

                {currentStep.answerOptions?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentStep.answerOptions.map((option) => (
                      <button
                        key={option.text}
                        type="button"
                        onClick={() => {
                          setSelectedOption(option.text);
                          setCheckResult('idle');
                          setDiagnosis(null);
                          setLumenFeedback('');
                        }}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                          selectedOption === option.text
                            ? 'border-lumen-blue bg-lumen-blue-soft text-lumen-blue'
                            : 'border-lumen-silver-light bg-lumen-bg text-lumen-graphite-light hover:border-lumen-teal/40'
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3">
                    <StudentInputBox
                      placeholder="Запиши свой ответ…"
                      buttonText="Проверить"
                      value={studentAnswer}
                      onChange={(value) => {
                        setStudentAnswer(value);
                        setCheckResult('idle');
                        setDiagnosis(null);
                        setLumenFeedback('');
                      }}
                      onSubmit={handleCheckStep}
                    />
                  </div>
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
                <LumenReply
                  text={lumenFeedback}
                  variant={
                    checkResult === 'correct' || checkResult === 'close' ? 'success' : 'default'
                  }
                />
              )}

              {diagnosis && checkResult === 'wrong' && (
                <ErrorDiagnosisCard
                  diagnosis={diagnosis}
                  onReturnToStep={handleReturnToStep}
                  onExplainSimpler={handleExplainSimplerFromDiagnosis}
                />
              )}

              {(checkResult === 'correct' || checkResult === 'close') && (
                <div className="rounded-xl border border-lumen-teal/30 bg-lumen-teal-soft/30 px-4 py-3">
                  <p className="text-sm text-lumen-graphite-light">{currentStep.content}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleShowHint}
                  className="lumen-btn-secondary text-sm"
                >
                  Подсказка от Люмена
                </button>
                {currentStep.answerOptions?.length ? (
                  <button
                    type="button"
                    onClick={handleCheckStep}
                    className="lumen-btn-primary text-sm"
                  >
                    Проверить
                  </button>
                ) : null}
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
