import { useState } from 'react';
import { GRADE6_READINESS_QUESTIONS } from '../../data/grade6Readiness';
import { LumenAvatar } from '../LumenAvatar/LumenAvatar';

interface Grade6ReadinessCheckProps {
  topicSlug: string;
}

export function Grade6ReadinessCheck({ topicSlug }: Grade6ReadinessCheckProps) {
  const questions = GRADE6_READINESS_QUESTIONS[topicSlug];
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!questions?.length) return null;

  const current = questions[step];

  function handleAnswer(isCorrect: boolean) {
    const nextErrors = isCorrect ? errors : errors + 1;
    if (isCorrect) {
      setFeedback('Верно.');
    } else {
      setFeedback('Почти. Это как раз то, что мы разберём в теме.');
    }

    setTimeout(() => {
      setFeedback(null);
      if (step + 1 >= questions.length) {
        setErrors(nextErrors);
        setFinished(true);
      } else {
        setErrors(nextErrors);
        setStep(step + 1);
      }
    }, 700);
  }

  const allCorrect = finished && errors === 0;

  return (
    <section className="lumen-card border-l-4 border-lumen-blue/30 p-5 sm:p-6">
      <p className="lumen-section-label">Мягкая проверка</p>
      <h2 className="mt-2 text-lg font-semibold text-lumen-graphite">
        Проверим, готов ли ты к теме
      </h2>
      <p className="mt-2 text-sm text-lumen-graphite-light">
        Три коротких вопроса. Это не оценка — просто подсказка, с чего начать.
      </p>

      {!finished ? (
        <div className="mt-6">
          <p className="text-xs font-medium text-lumen-silver">
            Вопрос {step + 1} из {questions.length}
          </p>
          <p className="mt-3 text-base font-medium text-lumen-graphite">{current.text}</p>
          <div className="mt-4 grid gap-2">
            {current.options.map((option) => (
              <button
                key={option.text}
                type="button"
                onClick={() => handleAnswer(option.isCorrect)}
                disabled={feedback !== null}
                className="rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3 text-left text-sm font-medium text-lumen-graphite transition-all hover:border-lumen-teal/40 disabled:opacity-60"
              >
                {option.text}
              </button>
            ))}
          </div>
          {feedback && (
            <p className="mt-3 text-sm text-lumen-teal">{feedback}</p>
          )}
        </div>
      ) : (
        <div className="mt-6 flex gap-4 rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/30 p-4 sm:p-5">
          <LumenAvatar size="sm" showLabel={false} className="shrink-0" />
          <p className="text-sm leading-relaxed text-lumen-graphite">
            {allCorrect
              ? 'Отлично. Можно переходить к новой теме.'
              : 'Тема всё равно доступна, но полезно повторить основу. Так будет легче.'}
          </p>
        </div>
      )}
    </section>
  );
}
