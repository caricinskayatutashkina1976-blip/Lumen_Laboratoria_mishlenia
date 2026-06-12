import { useState } from 'react';
import { getTopicUnderstandingResponse } from '../../data/lumenChatResponses';

export function TopicSelfAnswer() {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCheck() {
    setFeedback(getTopicUnderstandingResponse(answer));
  }

  return (
    <article className="lumen-card border-l-4 border-lumen-blue p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-lumen-graphite">
        Ответь своими словами
      </h3>
      <p className="mt-3 text-sm font-medium text-lumen-graphite">
        Как ты понял эту тему?
      </p>
      <textarea
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setFeedback(null);
        }}
        placeholder="Напиши коротко своими словами…"
        rows={3}
        className="mt-3 w-full rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3 text-sm text-lumen-graphite outline-none transition-colors focus:border-lumen-teal/50 focus:ring-2 focus:ring-lumen-teal/20"
      />
      <button type="button" onClick={handleCheck} className="lumen-btn-primary mt-3 text-sm">
        Проверить понимание
      </button>
      {feedback && (
        <div className="mt-4 rounded-xl border border-lumen-teal/25 bg-lumen-teal-soft/30 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">Люмен</p>
          <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">{feedback}</p>
        </div>
      )}
    </article>
  );
}
