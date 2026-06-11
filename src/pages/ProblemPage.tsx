import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { NextStepRecommendation } from '../components/NextStepRecommendation/NextStepRecommendation';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { ProblemStepSolver } from '../components/ProblemStepSolver/ProblemStepSolver';
import { VisualExplanationCard } from '../components/VisualExplanationCard/VisualExplanationCard';
import { useProgress } from '../context/ProgressContext';
import { getLumenMessage } from '../data/lumenMessages';
import { getProblemById } from '../data/problems';
import { getTopicById } from '../data/topics';
import type { ErrorType, NextStepRecommendationData } from '../types';

export function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const {
    solveProblem,
    unlockAchievement,
    recordStepError,
    recordErrorSelfFix,
    getLumenRecommendation,
    startProblemSession,
    trackProblemError,
    trackProblemHint,
    trackProblemStep,
    finishProblemSession,
  } = useProgress();
  const problem = problemId ? getProblemById(problemId) : undefined;
  const topic = problem ? getTopicById(problem.topicId) : undefined;
  const [studentAnswer, setStudentAnswer] = useState('');
  const [answerChecked, setAnswerChecked] = useState(false);
  const [allStepsDone, setAllStepsDone] = useState(false);
  const [recommendation, setRecommendation] = useState<NextStepRecommendationData | null>(
    null,
  );
  const [usedHint, setUsedHint] = useState(false);

  useEffect(() => {
    if (problem) startProblemSession(problem.id);
  }, [problem, startProblemSession]);
  if (!problem) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-lumen-graphite">Задача не найдена</h1>
        <Link to="/topics" className="mt-4 inline-block text-lumen-blue hover:underline">
          Вернуться к темам
        </Link>
      </div>
    );
  }

  function handleStepComplete(stepId: number) {
    trackProblemStep(problem!.id, stepId);
    if (stepId === 3) unlockAchievement('found-main');
    if (stepId === 1) unlockAchievement('see-question');
  }

  function handleAllComplete() {
    finishProblemSession(problem!.id, usedHint);
    solveProblem(problem!.id, problem!.topicId);
    unlockAchievement('understand-not-memorize');
    if (!usedHint) unlockAchievement('solved-no-hint');
    setAllStepsDone(true);
    setRecommendation(
      getLumenRecommendation('after-problem', { topicSlug: topic?.slug }),
    );
  }

  function handleSelfFix(errorType: ErrorType) {
    recordErrorSelfFix(errorType);
    setRecommendation(
      getLumenRecommendation('after-fix', {
        lastErrorType: errorType,
        topicSlug: topic?.slug,
      }),
    );
  }

  function handleStepError(errorType: ErrorType) {
    recordStepError(errorType);
    trackProblemError(problem!.id);
  }

  function handleCheckFinalAnswer() {
    setAnswerChecked(true);
  }

  const answerMatch =
    studentAnswer.trim().length > 0 &&
    (problem.correctAnswer.toLowerCase().includes(studentAnswer.trim().toLowerCase()) ||
      studentAnswer.trim().toLowerCase().includes(problem.correctAnswer.toLowerCase().slice(0, 3)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to={topic ? `/lesson/${topic.slug}` : '/topics'}
        className="text-sm text-lumen-silver transition-colors hover:text-lumen-blue"
      >
        ← К уроку
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <LumenAvatar size="md" showLabel={false} className="shrink-0" />
          <div>
            <p className="lumen-section-label">{topic?.title ?? 'Задача'}</p>
            <h1 className="mt-2 text-2xl font-bold text-lumen-graphite sm:text-3xl">
              {problem.title}
            </h1>
          </div>
        </div>
      </header>

      <section className="mb-8 lumen-card p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-lumen-teal-soft px-2 py-0.5 text-xs font-medium text-lumen-teal">
            {problem.lifeContext}
          </span>
          <span className="rounded-lg bg-lumen-bg px-2 py-0.5 text-xs text-lumen-silver">
            {problem.difficulty}
          </span>
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-lumen-silver">
          Условие
        </p>
        <p className="mt-3 text-base leading-relaxed text-lumen-graphite sm:text-lg">
          {problem.problemText}
        </p>

        {problem.hints.length > 0 && (
          <div className="mt-4 rounded-xl border border-lumen-blue/15 bg-lumen-blue-soft/20 px-4 py-3">
            <p className="text-xs font-medium text-lumen-blue">Подсказки перед решением</p>
            <ul className="mt-2 space-y-1 text-sm text-lumen-graphite-light">
              {problem.hints.map((hint) => (
                <li key={hint}>• {hint}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3">
          <p className="text-xs font-medium text-lumen-silver">Частая ошибка</p>
          <p className="mt-1 text-sm text-lumen-graphite-light">{problem.commonMistake}</p>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-lumen-silver-light bg-lumen-bg px-4 py-4">
          <label htmlFor="student-answer" className="text-xs font-medium text-lumen-silver">
            Твой ответ
          </label>
          <input
            id="student-answer"
            type="text"
            value={studentAnswer}
            onChange={(e) => {
              setStudentAnswer(e.target.value);
              setAnswerChecked(false);
            }}
            placeholder="Запиши ответ и единицы измерения"
            className="mt-2 w-full rounded-xl border border-lumen-silver-light bg-lumen-surface px-4 py-3 text-sm text-lumen-graphite outline-none transition-colors focus:border-lumen-teal/50 focus:ring-2 focus:ring-lumen-teal/20"
          />
          <button
            type="button"
            onClick={handleCheckFinalAnswer}
            className="lumen-btn-secondary mt-3 text-sm"
          >
            Проверить ответ
          </button>
          {answerChecked && (
            <p className={`mt-3 text-sm ${answerMatch ? 'text-lumen-teal' : 'text-lumen-graphite-light'}`}>
              {answerMatch
                ? getLumenMessage('correct-answer')
                : getLumenMessage('wrong-answer')}
            </p>
          )}
        </div>
      </section>

      <div className="mb-8">
        <LumenAssistant
          compact
          greeting="Сначала найдём, что известно. Потом поймём, что нужно найти."
          avatarSize="sm"
          showAvatarLabel={false}
          topicId={problem.topicId}
        />
      </div>

      <ProblemStepSolver
        steps={problem.steps}
        onStepComplete={handleStepComplete}
        onAllComplete={handleAllComplete}
        onStepError={handleStepError}
        onSelfFix={handleSelfFix}
        onHintUsed={() => {
          setUsedHint(true);
          trackProblemHint(problem.id);
        }}
      />

      {recommendation && (
        <div className="mt-8">
          <NextStepRecommendation recommendation={recommendation} />
        </div>
      )}

      {topic && (
        <div className="mt-8">
          <VisualExplanationCard topicId={topic.id} />
        </div>
      )}

      <div className="mt-8 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/30 px-5 py-4">
        <p className="text-xs font-medium text-lumen-teal">Эталонный ответ</p>
        {allStepsDone || answerMatch ? (
          <p className="mt-1 font-semibold text-lumen-graphite">{problem.correctAnswer}</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-lumen-graphite-light">
              Ответ откроется после прохождения всех шагов или правильной проверки.
            </p>
            <p className="mt-2 text-xs text-lumen-silver">
              Пройди разбор по шагам — так ты поймёшь, откуда берётся ответ.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
