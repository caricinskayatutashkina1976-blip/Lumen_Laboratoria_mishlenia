import type { ErrorDiagnosis } from '../../types';
import { getErrorSimpleExplanation } from '../../data/lumenMessages';

interface ErrorDiagnosisCardProps {
  diagnosis: ErrorDiagnosis;
  onReturnToStep: () => void;
  onExplainSimpler: () => void;
}

export function ErrorDiagnosisCard({
  diagnosis,
  onReturnToStep,
  onExplainSimpler,
}: ErrorDiagnosisCardProps) {
  return (
    <article className="rounded-xl border border-lumen-blue/20 bg-gradient-to-br from-lumen-surface to-lumen-blue-soft/20 px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
        Где возникла ошибка?
      </p>

      <div className="mt-3 inline-flex rounded-lg bg-lumen-blue-soft/60 px-3 py-1.5">
        <span className="text-sm font-medium text-lumen-blue">{diagnosis.label}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-lumen-graphite-light">
        {diagnosis.explanation}
      </p>

      <div className="mt-4 rounded-lg border border-lumen-teal/15 bg-lumen-teal-soft/25 px-3 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
          Что сделать сейчас
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">
          {diagnosis.whatToDo}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-lumen-graphite">
        {diagnosis.lumenMessage}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={onReturnToStep} className="lumen-btn-primary text-sm">
          Вернуться к нужному шагу
        </button>
        <button type="button" onClick={onExplainSimpler} className="lumen-btn-secondary text-sm">
          Объясни проще
        </button>
      </div>

      <p className="mt-3 text-xs text-lumen-silver">
        {getErrorSimpleExplanation(diagnosis.type)}
      </p>
    </article>
  );
}
