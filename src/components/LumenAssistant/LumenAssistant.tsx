import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LumenAction } from '../../types';
import { defaultGreeting } from '../../data/lumen';
import {
  actionMessages,
  getLumenMessage,
  getTopicConfusedMessage,
} from '../../data/lumenMessages';
import { getGeneralLumenResponse } from '../../data/lumenChatResponses';
import { LumenAvatar } from '../LumenAvatar/LumenAvatar';
import { VisualExplanationCard } from '../VisualExplanationCard/VisualExplanationCard';
import type { ChatMessage } from '../LumenChat/LumenChat';
import { StudentInputBox } from '../StudentInputBox/StudentInputBox';
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
  showQuestionInput = true,
}: LumenAssistantProps) {
  const [activeAction, setActiveAction] = useState<LumenAction | null>(null);
  const [showScheme, setShowScheme] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [lumenReaction, setLumenReaction] = useState<string | null>(null);

  function appendLumenToHistory(text: string) {
    const lumenMsg: ChatMessage = {
      id: `l-${Date.now()}`,
      role: 'lumen',
      text,
    };
    setChatMessages((prev) => [...prev, lumenMsg].slice(-5));
  }

  function handleAction(action: LumenAction) {
    setActiveAction(action);

    let response: string;

    if (action === 'still-confused') {
      response = getTopicConfusedMessage(topicId);
      setShowScheme(false);
    } else if (action === 'show-scheme') {
      response = actionMessages['show-scheme'];
      setShowScheme(true);
    } else if (action === 'explain-simpler') {
      response = actionMessages['explain-simpler'];
      setShowScheme(false);
    } else {
      response = actionMessages[action];
      setShowScheme(false);
    }

    setLumenReaction(response);
    appendLumenToHistory(response);
  }

  function handleAskQuestion() {
    const question = questionInput.trim();
    if (!question) {
      setLumenReaction('Сначала напиши вопрос. Даже короткая фраза поможет понять, где застрял.');
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
    setLumenReaction(response);
    setQuestionInput('');
    setActiveAction(null);
  }

  return (
    <section className="lumen-card overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-teal via-lumen-blue to-lumen-teal opacity-80" />
      <div className={`relative flex flex-col gap-5 ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'}`}>
        <div className={`flex gap-4 ${compact ? 'flex-row items-start' : 'flex-col gap-5 sm:flex-row sm:items-start'}`}>
          {showAvatar && (
            <div className={`shrink-0 ${compact ? '' : 'mx-auto sm:mx-0'}`}>
              <LumenAvatar
                size={compact ? 'sm' : avatarSize}
                showLabel={showAvatarLabel}
              />
              {!compact && (
                <p className="mt-1 text-center text-xs text-lumen-silver">Наставник</p>
              )}
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-3">
            {!compact && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                  Наставник
                </p>
                <h2 className="mt-1 text-lg font-semibold text-lumen-graphite sm:text-xl">
                  Люмен
                </h2>
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

        {showHomeworkButton && (
          <Link to="/homework" className="lumen-btn-primary inline-flex w-full justify-center text-sm sm:w-auto">
            Помочь с домашним заданием
          </Link>
        )}

        {lumenReaction && <LumenReply text={lumenReaction} />}

        {showQuestionInput && (
          <div className="rounded-xl border border-lumen-silver-light bg-lumen-surface p-4 sm:p-5">
            <StudentInputBox
              label="Напиши Люмену"
              placeholder="Напиши, что непонятно, или задай вопрос…"
              buttonText="Отправить"
              value={questionInput}
              onChange={setQuestionInput}
              onSubmit={handleAskQuestion}
              id="lumen-assistant-question"
            />
          </div>
        )}

        <ChatHistory messages={chatMessages} />

        {(showScheme || showVisual) && topicId && (
          <VisualExplanationCard topicId={topicId} />
        )}
      </div>
    </section>
  );
}
