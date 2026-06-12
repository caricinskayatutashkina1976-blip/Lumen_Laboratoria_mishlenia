import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { NextStepRecommendation } from '../components/NextStepRecommendation/NextStepRecommendation';
import { ProblemLumenChat } from '../components/ProblemLumenChat/ProblemLumenChat';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { ProblemStepSolver } from '../components/ProblemStepSolver/ProblemStepSolver';
import { VisualExplanationCard } from '../components/VisualExplanationCard/VisualExplanationCard';
import { useProgress } from '../context/ProgressContext';
import { getFinalAnswerFeedback } from '../data/lumenChatResponses';
import { getProblemById } from '../data/problems';
import { getTopicById } from '../data/topics';
import { StudentInputBox } from '../components/StudentInputBox/StudentInputBox';
import { LumenReply } from '../components/LumenReply/LumenReply';
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
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
  const [allStepsDone, setAllStepsDone] = useState(false);
  const [recommendation, setRecommendation] = useState<NextStepRecommendationData | null>(null);
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

  const currentProblem = problem;

  const answerMatch =
    studentAnswer.trim().length > 0 &&
    (currentProblem.correctAnswer.toLowerCase().includes(studentAnswer.trim().toLowerCase()) ||
      studentAnswer
        .trim()
        .toLowerCase()
        .includes(currentProblem.correctAnswer.toLowerCase().slice(0, 3)));

  function handleStepComplete(stepId: number) {
    trackProblemStep(currentProblem.id, stepId);
    if (stepId === 3) unlockAchievement('found-main');
    if (stepId === 1) unlockAchievement('see-question');
  }

  function handleAllComplete() {
    finishProblemSession(currentProblem.id, usedHint);
    solveProblem(currentProblem.id, currentProblem.topicId);
    unlockAchievement('understand-not-memorize');
    if (!usedHint) unlockAchievement('solved-no-hint');
    setAllStepsDone(true);
    setRecommendation(getLumenRecommendation('after-problem', { topicSlug: topic?.slug }));
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
    trackProblemError(currentProblem.id);
  }

  function handleCheckFinalAnswer() {
    setAnswerFeedback(getFinalAnswerFeedback(studentAnswer, answerMatch));
  }

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
              {currentProblem.title}
            </h1>
          </div>
        </div>
      </header>

      <section className="mb-8 lumen-card p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-lumen-teal-soft px-2 py-0.5 text-xs font-medium text-lumen-teal">
            {currentProblem.lifeContext}
          </span>
          <span className="rounded-lg bg-lumen-bg px-2 py-0.5 text-xs text-lumen-silver">
            {currentProblem.difficulty}
          </span>
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-lumen-silver">Условие</p>
        <p className="mt-3 text-base leading-relaxed text-lumen-graphite sm:text-lg">
          {currentProblem.problemText}
        </p>

        {currentProblem.hints.length > 0 && (
          <div className="mt-4 rounded-xl border border-lumen-blue/15 bg-lumen-blue-soft/20 px-4 py-3">
            <p className="text-xs font-medium text-lumen-blue">Подсказки перед решением</p>
            <ul className="mt-2 space-y-1 text-sm text-lumen-graphite-light">
              {currentProblem.hints.map((hint) => (
                <li key={hint}>• {hint}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3">
          <p className="text-xs font-medium text-lumen-silver">Частая ошибка</p>
          <p className="mt-1 text-sm text-lumen-graphite-light">{currentProblem.commonMistake}</p>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-lumen-silver-light bg-lumen-bg px-4 py-4">
          <StudentInputBox
            label="Твой ответ"
            placeholder="Запиши ответ и единицы измерения"
            buttonText="Проверить"
            value={studentAnswer}
            onChange={(value) => {
              setStudentAnswer(value);
              setAnswerFeedback(null);
            }}
            onSubmit={handleCheckFinalAnswer}
            id="student-answer"
          />
          {answerFeedback && (
            <div className="mt-4">
              <LumenReply text={answerFeedback} />
            </div>
          )}
        </div>
      </section>

      <div className="mb-8">
        <VisualExplanationCard visualType={currentProblem.visualType} topicId={currentProblem.topicId} />
      </div>

      <div className="mb-8">
        <ProblemLumenChat
          context={{
            title: currentProblem.title,
            problemText: currentProblem.problemText,
            lifeContext: currentProblem.lifeContext,
            commonMistake: currentProblem.commonMistake,
          }}
        />
      </div>

      <ProblemStepSolver
        steps={currentProblem.steps}
        onStepComplete={handleStepComplete}
        onAllComplete={handleAllComplete}
        onStepError={handleStepError}
        onSelfFix={handleSelfFix}
        onHintUsed={() => {
          setUsedHint(true);
          trackProblemHint(currentProblem.id);
        }}
      />

      {recommendation && (
        <div className="mt-8">
          <NextStepRecommendation recommendation={recommendation} />
        </div>
      )}

      <div className="mt-8 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/30 px-5 py-4">
        <p className="text-xs font-medium text-lumen-teal">Эталонный ответ</p>
        {allStepsDone || answerMatch ? (
          <p className="mt-1 font-semibold text-lumen-graphite">{currentProblem.correctAnswer}</p>
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
