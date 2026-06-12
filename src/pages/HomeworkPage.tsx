import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeworkStepSolver, HomeworkSummary } from '../components/HomeworkStepSolver/HomeworkStepSolver';
import { HomeworkVisual } from '../components/HomeworkVisual/HomeworkVisual';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { LumenReply } from '../components/LumenReply/LumenReply';
import { StudentInputBox } from '../components/StudentInputBox/StudentInputBox';
import { useProgress } from '../context/ProgressContext';
import { buildHomeworkBreakdown } from '../data/homeworkAnalyzer';
import {
  clearHomeworkDraft,
  loadHomeworkDraft,
  type HomeworkDraft,
} from '../utils/homeworkStorage';

type PagePhase = 'input' | 'solving' | 'summary';

export function HomeworkPage() {
  const { unlockAchievement } = useProgress();
  const [condition, setCondition] = useState('');
  const [phase, setPhase] = useState<PagePhase>('input');
  const [breakdown, setBreakdown] = useState<ReturnType<typeof buildHomeworkBreakdown> | null>(
    null,
  );
  const [finalAnswers, setFinalAnswers] = useState<Record<number, string>>({});
  const [pendingDraft, setPendingDraft] = useState<HomeworkDraft | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [emptyHint, setEmptyHint] = useState<string | null>(null);

  useEffect(() => {
    const draft = loadHomeworkDraft();
    if (draft && !draft.completed) {
      setPendingDraft(draft);
      setShowResumePrompt(true);
    }
  }, []);

  function handleAnalyze() {
    if (!condition.trim()) {
      setEmptyHint(
        'Сначала вставь условие задачи. Можно просто переписать его из учебника или тетради.',
      );
      return;
    }
    setEmptyHint(null);
    const result = buildHomeworkBreakdown(condition);
    setBreakdown(result);
    setPhase('solving');
    setShowResumePrompt(false);
    setPendingDraft(null);
  }

  function handleResume() {
    if (!pendingDraft) return;
    setCondition(pendingDraft.condition);
    setBreakdown(buildHomeworkBreakdown(pendingDraft.condition));
    setPhase('solving');
    setShowResumePrompt(false);
  }

  function handleStartFresh() {
    clearHomeworkDraft();
    setPendingDraft(null);
    setShowResumePrompt(false);
    setCondition('');
    setBreakdown(null);
    setPhase('input');
    setFinalAnswers({});
  }

  function handleComplete(answers: Record<number, string>) {
    setFinalAnswers(answers);
    setPhase('summary');
    unlockAchievement('homework-steps-done');
  }

  function handleNewTask() {
    clearHomeworkDraft();
    setCondition('');
    setBreakdown(null);
    setPhase('input');
    setFinalAnswers({});
    setShowResumePrompt(false);
    setPendingDraft(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link to="/" className="text-sm text-lumen-silver transition-colors hover:text-lumen-blue">
        ← На главную
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <LumenAvatar size="md" showLabel={false} className="shrink-0" />
          <div>
            <p className="lumen-section-label">Помощь без списывания</p>
            <h1 className="mt-2 text-2xl font-bold text-lumen-graphite sm:text-3xl">
              Помощь с домашним заданием
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
              Вставь условие задачи. Люмен поможет разобрать её по шагам, но не будет просто
              выдавать ответ.
            </p>
            <blockquote className="mt-4 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/30 px-4 py-3">
              <p className="text-sm leading-relaxed text-lumen-graphite-light">
                Люмен не решает задачу вместо тебя. Он помогает понять условие, найти данные,
                выбрать действие и проверить ответ.
              </p>
            </blockquote>
          </div>
        </div>
      </header>

      {showResumePrompt && pendingDraft && phase === 'input' && (
        <section className="mb-6 lumen-card border-l-4 border-lumen-blue p-5 sm:p-6">
          <p className="text-sm font-medium text-lumen-graphite">
            У тебя есть незавершённая задача. Продолжить?
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-lumen-graphite-light">
            {pendingDraft.condition}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={handleResume} className="lumen-btn-primary text-sm">
              Продолжить
            </button>
            <button type="button" onClick={handleStartFresh} className="lumen-btn-secondary text-sm">
              Начать заново
            </button>
          </div>
        </section>
      )}

      {phase === 'input' && (
        <section className="lumen-card p-5 sm:p-6">
          <StudentInputBox
            label="Условие задачи"
            placeholder="Вставь сюда условие задачи…"
            buttonText="Разобрать задачу"
            multiline
            rows={8}
            value={condition}
            onChange={(value) => {
              setCondition(value);
              setEmptyHint(null);
            }}
            onSubmit={handleAnalyze}
            id="homework-condition"
            submitOnEnter={false}
          />
          {emptyHint && <div className="mt-4"><LumenReply text={emptyHint} variant="hint" /></div>}
        </section>
      )}

      {phase === 'solving' && breakdown && (
        <div className="space-y-6">
          <HomeworkVisual type={breakdown.type} />
          <HomeworkStepSolver
            condition={condition}
            type={breakdown.type}
            typeLabel={breakdown.typeLabel}
            initialDraft={
              pendingDraft && pendingDraft.condition === condition ? pendingDraft : null
            }
            onComplete={handleComplete}
          />
          <button type="button" onClick={handleNewTask} className="lumen-btn-secondary text-sm">
            Начать другую задачу
          </button>
        </div>
      )}

      {phase === 'summary' && breakdown && (
        <HomeworkSummary
          condition={condition}
          typeLabel={breakdown.typeLabel}
          answers={finalAnswers}
          onNewTask={handleNewTask}
        />
      )}
    </div>
  );
}
