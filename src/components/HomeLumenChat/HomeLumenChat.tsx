import type { CSSProperties, FormEvent } from 'react';

const INPUT_STYLE: CSSProperties = {
  display: 'block',
  width: '100%',
  minHeight: '52px',
  padding: '14px 16px',
  border: '2px solid #94a3b8',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  color: '#1e293b',
  fontSize: '15px',
  boxSizing: 'border-box',
};

const CARD_STYLE: CSSProperties = {
  display: 'block',
  marginTop: '16px',
  marginBottom: '16px',
  padding: '20px',
  border: '2px solid #0d9488',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 16px rgba(30, 41, 59, 0.12)',
};

interface HomeLumenChatProps {
  question: string;
  hint: string | null;
  onQuestionChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

/** Поле ввода на главной — всегда видимо, без условий. */
export function HomeLumenChat({
  question,
  hint,
  onQuestionChange,
  onSubmit,
}: HomeLumenChatProps) {
  return (
    <div id="home-lumen-input-block" style={CARD_STYLE} data-testid="home-lumen-input-block">
      <h3 className="text-base font-bold text-lumen-graphite" style={{ margin: 0 }}>
        Напиши Люмену
      </h3>
      <p className="mt-2 text-sm text-lumen-graphite-light" style={{ marginTop: '8px' }}>
        Можно написать: я не понял тему, помоги с задачей, проверь мой ответ.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
        style={{ marginTop: '16px' }}
      >
        <input
          id="home-lumen-question-input"
          name="home-lumen-question"
          type="text"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="Напиши вопрос или то, что непонятно…"
          autoComplete="off"
          style={INPUT_STYLE}
        />
        <button
          type="submit"
          className="lumen-btn-primary shrink-0 px-6 py-3 text-sm"
          style={{ minHeight: '52px', minWidth: '130px' }}
        >
          Отправить
        </button>
      </form>

      {hint && (
        <p className="mt-3 text-sm text-lumen-blue" style={{ marginTop: '12px' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
