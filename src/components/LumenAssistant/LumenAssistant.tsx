import { useState } from 'react';

import type { LumenAction } from '../../types';

import { defaultGreeting } from '../../data/lumen';

import {

  actionMessages,

  getLumenMessage,

  getTopicConfusedMessage,

} from '../data/lumenMessages';

import { LumenAvatar } from '../LumenAvatar/LumenAvatar';

import { VisualExplanationCard } from '../VisualExplanationCard/VisualExplanationCard';



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

}



const actionButtons: { action: LumenAction; label: string }[] = [

  { action: 'explain-simpler', label: 'Объясни проще' },

  { action: 'show-example', label: 'Покажи пример' },

  { action: 'step-by-step', label: 'Разбери по шагам' },

  { action: 'show-scheme', label: 'Покажи наглядно' },

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

}: LumenAssistantProps) {

  const [message, setMessage] = useState(greeting);

  const [activeAction, setActiveAction] = useState<LumenAction | null>(null);

  const [showScheme, setShowScheme] = useState(false);



  function handleAction(action: LumenAction) {

    setActiveAction(action);



    if (action === 'still-confused') {

      setMessage(getTopicConfusedMessage(topicId));

      setShowScheme(false);

      return;

    }



    if (action === 'show-scheme') {

      setMessage(actionMessages['show-scheme']);

      setShowScheme(true);

      return;

    }



    if (action === 'explain-simpler') {

      setMessage(getLumenMessage('not-understood'));

      setShowScheme(false);

      return;

    }



    setMessage(actionMessages[action]);

    setShowScheme(false);

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

                <p className="mt-1 text-center text-xs text-lumen-silver">AI-наставник</p>

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

                } ${activeAction === 'still-confused' ? 'font-medium text-lumen-graphite' : ''}`}

              >

                {message}

              </p>

            </div>

          </div>

        </div>



        {(showScheme || showVisual) && topicId && (

          <VisualExplanationCard topicId={topicId} />

        )}



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

      </div>

    </section>

  );

}

