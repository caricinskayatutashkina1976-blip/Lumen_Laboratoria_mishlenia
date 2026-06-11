import { Link, useParams } from 'react-router-dom';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { ProblemStepSolver } from '../components/ProblemStepSolver/ProblemStepSolver';
import { useProgress } from '../context/ProgressContext';
import { getProblemById } from '../data/problems';
import { getTopicById } from '../data/topics';

export function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const { solveProblem, unlockAchievement } = useProgress();
  const problem = problemId ? getProblemById(problemId) : undefined;
  const topic = problem ? getTopicById(problem.topicId) : undefined;

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
          <LumenAvatar size="md" className="shrink-0" />
          <div>
            <p className="lumen-section-label">{topic?.title ?? 'Задача'}</p>
            <h1 className="mt-2 text-2xl font-bold text-lumen-graphite sm:text-3xl">
              {problem.title}
            </h1>
          </div>
        </div>
      </header>

      <section className="mb-8 lumen-card p-6 sm:p-8">
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
            placeholder="Запиши ответ и единицы измерения"
            className="mt-2 w-full rounded-xl border border-lumen-silver-light bg-lumen-surface px-4 py-3 text-sm text-lumen-graphite outline-none transition-colors focus:border-lumen-teal/50 focus:ring-2 focus:ring-lumen-teal/20"
          />
        </div>
      </section>

      <div className="mb-8">
        <LumenAssistant
          compact
          greeting="Сначала найдём, что известно. Потом поймём, что нужно найти."
          avatarSize="sm"
        />
      </div>

      <ProblemStepSolver
        steps={problem.steps}
        onStepComplete={handleStepComplete}
        onAllComplete={handleAllComplete}
      />

      <div className="mt-8 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/30 px-5 py-4">
        <p className="text-xs font-medium text-lumen-teal">Эталонный ответ</p>
        <p className="mt-1 font-semibold text-lumen-graphite">{problem.answer}</p>
        <p className="mt-2 text-sm text-lumen-graphite-light">
          В рабочей версии ответ откроется после самостоятельного решения.
        </p>
      </div>
    </div>
  );
}
