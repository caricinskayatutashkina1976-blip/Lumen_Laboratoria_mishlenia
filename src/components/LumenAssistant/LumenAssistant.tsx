import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { LumenAction } from '../../types';
import { defaultGreeting } from '../../data/lumen';
import { actionMessages, getTopicConfusedMessage } from '../../data/lumenMessages';
import { getGeneralLumenResponse } from '../../data/lumenChatResponses';
import { LumenAvatar } from '../LumenAvatar/LumenAvatar';
import { VisualExplanationCard } from '../VisualExplanationCard/VisualExplanationCard';
import type { ChatMessage } from '../LumenChat/LumenChat';
import { LumenReply } from '../LumenReply/LumenReply';
import { ChatHistory } from '../ChatHistory/ChatHistory';

interface LumenAssistantProps {
  greeting?: string;
  compact?: boolean;
  showWhyButton?: boolean;
  onWhyClick?: () => void;
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showAvatar?: boolean;
  showAvatarLabel?: boolean;
  topicId?: string;
  showVisual?: boolean;
  showHomeworkButton?: boolean;
  /** Показывать поле ввода вопроса. По умолчанию true. */
  showInput?: boolean;
  /** @deprecated Используйте showInput */
  showQuestionInput?: boolean;
}

const actionButtons: { action: LumenAction; label: string }[] = [
  { action: 'explain-simpler', label: 'Объясни проще' },
  { action: 'show-example', label: 'Покажи пример' },
  { action: 'step-by-step', label: 'Разбери по шагам' },
  { action: 'show-scheme', label: 'Покажи схему' },
  { action: 'easier-problem', label: 'Дай задачу полегче' },
  { action: 'check-answer', label: 'Проверь мой ответ' },
  { action: 'still-confused', label: 'Я всё равно не понял' },
];

export function LumenAssistant({
  greeting = defaultGreeting,
  compact = false,
  showWhyButton = false,
  onWhyClick,
  avatarSize = 'md',
  showAvatar = true,
  showAvatarLabel = true,
  topicId,
  showVisual = false,
  showHomeworkButton = true,
  showInput = true,
  showQuestionInput,
}: LumenAssistantProps) {
  const inputVisible = showQuestionInput !== false && showInput !== false;

  const [activeAction, setActiveAction] = useState<LumenAction | null>(null);
  const [showScheme, setShowScheme] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [actionReaction, setActionReaction] = useState<string | null>(null);
  const [inputHint, setInputHint] = useState<string | null>(null);

  function handleAction(action: LumenAction) {
    setActiveAction(action);
    setInputHint(null);

    let response: string;

    if (action === 'still-confused') {
      response = topicId
        ? getTopicConfusedMessage(topicId)
        : actionMessages['still-confused'];
      setShowScheme(false);
    } else if (action === 'show-scheme') {
      response = actionMessages['show-scheme'];
      setShowScheme(true);
    } else {
      response = actionMessages[action];
      setShowScheme(false);
    }

    setActionReaction(response);
  }

  function handleAskQuestion(e?: FormEvent) {
    e?.preventDefault();
    const question = questionInput.trim();

    if (!question) {
      setInputHint('Сначала напиши вопрос или то, что непонятно.');
      return;
    }

    const response = getGeneralLumenResponse(question);
    const studentMsg: ChatMessage = {
      id: `s-${Date.now()}`,
      role: 'student',
      text: question,
    };
    const lumenMsg: ChatMessage = {
      id: `l-${Date.now() + 1}`,
      role: 'lumen',
      text: response,
    };

    setChatMessages((prev) => [...prev, studentMsg, lumenMsg].slice(-5));
    setQuestionInput('');
    setInputHint(null);
    setActiveAction(null);
  }

  const inputClassName =
    'min-h-[48px] w-full flex-1 rounded-xl border-2 border-lumen-silver-light bg-white px-4 py-3 text-sm text-lumen-graphite shadow-sm outline-none transition-colors placeholder:text-lumen-silver focus:border-lumen-teal focus:ring-2 focus:ring-lumen-teal/25';

  return (
    <section className="lumen-card">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-teal via-lumen-blue to-lumen-teal opacity-80" />
      <div className={`relative flex flex-col gap-5 ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'}`}>
        <div
          className={`flex gap-4 ${compact ? 'flex-row items-start' : 'flex-col gap-5 sm:flex-row sm:items-start'}`}
        >
          {showAvatar && (
            <div className={`shrink-0 ${compact ? '' : 'mx-auto sm:mx-0'}`}>
              <LumenAvatar size={compact ? 'sm' : avatarSize} showLabel={showAvatarLabel} />
              {!compact && <p className="mt-1 text-center text-xs text-lumen-silver">Наставник</p>}
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-3">
            {!compact && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">Наставник</p>
                <h2 className="mt-1 text-lg font-semibold text-lumen-graphite sm:text-xl">Люмен</h2>
              </div>
            )}

            {compact && (
              <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                Наставник Люмен
              </p>
            )}

            <div
              className={`rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/40 ${
                compact ? 'px-3 py-3' : 'px-4 py-4'
              }`}
            >
              <p
                className={`leading-relaxed text-lumen-graphite-light ${
                  compact ? 'text-sm' : 'text-sm sm:text-base'
                }`}
              >
                {greeting}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {actionButtons.map(({ action, label }) => (
            <button
              key={action}
              type="button"
              onClick={() => handleAction(action)}
              className={`lumen-btn-secondary text-sm ${
                activeAction === action ? 'border-lumen-teal/50 bg-lumen-teal-soft/30' : ''
              }`}
            >
              {label}
            </button>
          ))}
          {showWhyButton && onWhyClick && (
            <button type="button" onClick={onWhyClick} className="lumen-btn-accent text-sm">
              Зачем мне это нужно?
            </button>
          )}
        </div>

        {actionReaction && <LumenReply text={actionReaction} />}

        {inputVisible && (
          <div
            className="rounded-xl border-2 border-lumen-teal/30 bg-white p-4 shadow-sm sm:p-5"
            data-testid="lumen-assistant-input-block"
          >
            <h3 className="text-sm font-semibold text-lumen-graphite">Напиши Люмену</h3>
            <form
              onSubmit={handleAskQuestion}
              className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-stretch"
            >
              <input
                id="lumen-assistant-question"
                type="text"
                value={questionInput}
                onChange={(e) => {
                  setQuestionInput(e.target.value);
                  setInputHint(null);
                }}
                placeholder="Напиши вопрос или то, что непонятно…"
                className={inputClassName}
                autoComplete="off"
              />
              <button
                type="submit"
                className="lumen-btn-primary shrink-0 px-6 py-3 text-sm sm:self-stretch"
              >
                Отправить
              </button>
            </form>

            {inputHint && (
              <div className="mt-3">
                <LumenReply text={inputHint} variant="hint" />
              </div>
            )}

            {chatMessages.length > 0 && (
              <div className="mt-4 border-t border-lumen-silver-light pt-4">
                <ChatHistory messages={chatMessages} />
              </div>
            )}
          </div>
        )}

        {showHomeworkButton && (
          <Link
            to="/homework"
            className="lumen-btn-primary inline-flex w-full justify-center text-sm sm:w-auto"
          >
            Помочь с домашним заданием
          </Link>
        )}

        {(showScheme || showVisual) && topicId && <VisualExplanationCard topicId={topicId} />}
      </div>
    </section>
  );
}
