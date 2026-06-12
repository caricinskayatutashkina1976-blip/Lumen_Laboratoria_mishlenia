import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { LumenAction } from '../../types';
import { actionMessages } from '../../data/lumenMessages';
import { getGeneralLumenResponse } from '../../data/lumenChatResponses';
import { LumenAvatar } from '../LumenAvatar/LumenAvatar';
import { HomeLumenChat } from '../HomeLumenChat/HomeLumenChat';
import { LumenReply } from '../LumenReply/LumenReply';
import { ChatHistory } from '../ChatHistory/ChatHistory';
import type { ChatMessage } from '../LumenChat/LumenChat';

const GREETING =
  'Выбери, чем помочь — объясню проще, покажу пример или разберём по шагам.';

const quickButtons: { action: LumenAction; label: string }[] = [
  { action: 'explain-simpler', label: 'Объясни проще' },
  { action: 'show-example', label: 'Покажи пример' },
  { action: 'step-by-step', label: 'Разбери по шагам' },
  { action: 'show-scheme', label: 'Покажи схему' },
  { action: 'easier-problem', label: 'Дай задачу полегче' },
  { action: 'check-answer', label: 'Проверь мой ответ' },
  { action: 'still-confused', label: 'Я всё равно не понял' },
];

/** Блок «Наставник Люмен» на главной — поле ввода без условного скрытия. */
export function HomeLumenMentor() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<LumenAction | null>(null);
  const [actionReaction, setActionReaction] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = question.trim();

    if (!text) {
      setHint('Сначала напиши вопрос или то, что непонятно.');
      return;
    }

    const reply = getGeneralLumenResponse(text);
    const studentMsg: ChatMessage = {
      id: `s-${Date.now()}`,
      role: 'student',
      text,
    };
    const lumenMsg: ChatMessage = {
      id: `l-${Date.now() + 1}`,
      role: 'lumen',
      text: reply,
    };
    setMessages((prev) => [...prev, studentMsg, lumenMsg].slice(-5));
    setQuestion('');
    setHint(null);
    setActiveAction(null);
    setActionReaction(null);
  }

  function handleQuickAction(action: LumenAction) {
    setActiveAction(action);
    setActionReaction(actionMessages[action]);
  }

  return (
    <section className="lumen-card" id="home-lumen-mentor">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-teal via-lumen-blue to-lumen-teal opacity-80" />
      <div className="relative flex flex-col gap-5 p-4 sm:p-5">
        <div className="flex flex-row items-start gap-4">
          <div className="shrink-0">
            <LumenAvatar size="sm" showLabel={false} />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
              Наставник Люмен
            </p>
            <div className="rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/40 px-3 py-3">
              <p className="text-sm leading-relaxed text-lumen-graphite-light">{GREETING}</p>
            </div>
          </div>
        </div>

        <HomeLumenChat
          question={question}
          hint={hint}
          onQuestionChange={(value) => {
            setQuestion(value);
            setHint(null);
          }}
          onSubmit={handleSubmit}
        />

        <div className="flex flex-wrap gap-2">
          {quickButtons.map(({ action, label }) => (
            <button
              key={action}
              type="button"
              onClick={() => handleQuickAction(action)}
              className={`lumen-btn-secondary text-sm ${
                activeAction === action ? 'border-lumen-teal/50 bg-lumen-teal-soft/30' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {actionReaction && <LumenReply text={actionReaction} />}

        {messages.length > 0 && <ChatHistory messages={messages} />}

        <Link
          to="/homework"
          className="lumen-btn-primary inline-flex w-full justify-center text-sm sm:w-auto"
        >
          Помочь с домашним заданием
        </Link>
      </div>
    </section>
  );
}
