import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { ProblemStepSolver } from '../components/ProblemStepSolver/ProblemStepSolver';
import { VisualExplanationCard } from '../components/VisualExplanationCard/VisualExplanationCard';
import { useProgress } from '../context/ProgressContext';
import { getLumenMessage } from '../data/lumenMessages';
import { getProblemById } from '../data/problems';
import { getTopicById } from '../data/topics';

export function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const { solveProblem, unlockAchievement } = useProgress();
  const problem = problemId ? getProblemById(problemId) : undefined;
  const topic = problem ? getTopicById(problem.topicId) : undefined;
  const [studentAnswer, setStudentAnswer] = useState('');
  const [answerChecked, setAnswerChecked] = useState(false);
  const [allStepsDone, setAllStepsDone] = useState(false);

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
    if (stepId === 3) unlockAchievement('found-main');
    if (stepId === 1) unlockAchievement('see-question');
  }

  function handleAllComplete() {
    solveProblem(problem!.id, problem!.topicId);
    unlockAchievement('understand-not-memorize');
    unlockAchievement('solved-no-hint');
    setAllStepsDone(true);
  }

  function handleCheckFinalAnswer() {
    setAnswerChecked(true);
  }

  const answerMatch =
    studentAnswer.trim().length > 0 &&
    problem.answer.toLowerCase().includes(studentAnswer.trim().toLowerCase().slice(0, 3));

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
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-silver">
          Условие
        </p>
        <p className="mt-3 text-base leading-relaxed text-lumen-graphite sm:text-lg">
          {problem.condition}
        </p>

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
      />

      {topic && (
        <div className="mt-8">
          <VisualExplanationCard topicId={topic.id} />
        </div>
      )}

      <div className="mt-8 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/30 px-5 py-4">
        <p className="text-xs font-medium text-lumen-teal">Эталонный ответ</p>
        {allStepsDone || answerMatch ? (
          <p className="mt-1 font-semibold text-lumen-graphite">{problem.answer}</p>
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
