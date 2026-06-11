import { useState } from 'react';
import type { LumenAction } from '../../types';
import { defaultGreeting, lumenResponses } from '../../data/lumen';
import { LumenAvatar } from '../LumenAvatar/LumenAvatar';

interface LumenAssistantProps {
  greeting?: string;
  compact?: boolean;
  showWhyButton?: boolean;
  onWhyClick?: () => void;
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl';
  showAvatar?: boolean;
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
}: LumenAssistantProps) {
  const [message, setMessage] = useState(greeting);

  function handleAction(action: LumenAction) {
    setMessage(lumenResponses[action].message);
  }

  return (
    <section className="lumen-card overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-teal via-lumen-blue to-lumen-teal opacity-80" />
      <div className={`relative flex flex-col gap-6 ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {showAvatar && (
            <div className="mx-auto shrink-0 sm:mx-0">
              <LumenAvatar size={compact ? 'sm' : avatarSize} />
              <p className="mt-1 text-center text-xs text-lumen-silver">AI-наставник</p>
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
                Наставник
              </p>
              <h2 className="mt-1 text-lg font-semibold text-lumen-graphite sm:text-xl">
                Люмен
              </h2>
            </div>

            <div className="rounded-xl border border-lumen-teal/20 bg-lumen-teal-soft/40 px-4 py-4">
              <p className="text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
                {message}
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
              className="lumen-btn-secondary"
            >
              {label}
            </button>
          ))}
          {showWhyButton && onWhyClick && (
            <button type="button" onClick={onWhyClick} className="lumen-btn-accent">
              Зачем мне это нужно?
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
