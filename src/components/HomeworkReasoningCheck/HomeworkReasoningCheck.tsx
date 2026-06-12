import { useState } from 'react';
import type { HomeworkType } from '../../data/homeworkAnalyzer';
import {
  evaluateReasoning,
  getConfidenceHint,
  verifyHomeworkCondition,
  type VerificationConfidence,
} from '../../data/homeworkVerifier';
import { LumenReply } from '../LumenReply/LumenReply';

interface HomeworkReasoningCheckProps {
  condition: string;
  type: HomeworkType;
}

const CONFIDENCE_BADGE: Record<VerificationConfidence, string> = {
  exact: 'bg-lumen-teal-soft text-lumen-teal border-lumen-teal/30',
  manual: 'bg-lumen-blue-soft text-lumen-blue border-lumen-blue/30',
  insufficient: 'bg-lumen-bg text-lumen-silver border-lumen-silver-light',
};

const INPUT_CLASS =
  'mt-1.5 w-full rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3 text-sm text-lumen-graphite outline-none focus:border-lumen-teal/50 focus:ring-2 focus:ring-lumen-teal/20';

export function HomeworkReasoningCheck({ condition, type }: HomeworkReasoningCheckProps) {
  const verification = verifyHomeworkCondition(condition, type);
  const [question, setQuestion] = useState('');
  const [numbers, setNumbers] = useState('');
  const [action, setAction] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCheck() {
    const result = evaluateReasoning(condition, type, {
      question,
      numbers,
      action,
      answer,
    });
    setFeedback(result.message);
  }

  return (
    <section className="lumen-card border-l-4 border-lumen-blue/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-lumen-graphite">Проверим ход решения</h2>
        <span
          className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${CONFIDENCE_BADGE[verification.confidence]}`}
        >
          {verification.confidenceLabel}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light">
        {getConfidenceHint(verification.confidence)}
      </p>

      {verification.calculationSteps.length > 0 && (
        <div className="mt-3 rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3">
          <p className="text-xs font-medium text-lumen-silver">
            Подсказка для проверки (не готовый ответ)
          </p>
          <p className="mt-1 text-sm text-lumen-graphite-light">
            {verification.calculationSteps.join(' → ')}
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-lumen-graphite">
          Что нужно найти?
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Главный вопрос задачи…"
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm font-medium text-lumen-graphite">
          Какие числа ты использовал?
          <input
            type="text"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            placeholder="Числа из условия…"
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm font-medium text-lumen-graphite">
          Какое действие выбрал?
          <input
            type="text"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="Умножение, сложение…"
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm font-medium text-lumen-graphite">
          Какой ответ получил?
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Итог с единицами…"
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <button type="button" onClick={handleCheck} className="lumen-btn-primary mt-4 text-sm">
        Проверить рассуждение
      </button>

      {feedback && (
        <div className="mt-4">
          <LumenReply text={feedback} />
        </div>
      )}
    </section>
  );
}
