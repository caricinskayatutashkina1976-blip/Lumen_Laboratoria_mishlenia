import type { LumenAction, LumenResponse } from '../types';
import { actionMessages, getLumenMessage } from './lumenMessages';

export const defaultGreeting =
  'Привет. Я Люмен. Давай разбираться спокойно и по шагам.';

export const lumenResponses: Record<LumenAction, LumenResponse> = {
  'explain-simpler': {
    action: 'explain-simpler',
    message: getLumenMessage('not-understood'),
  },
  'show-example': {
    action: 'show-example',
    message: actionMessages['show-example'],
  },
  'step-by-step': {
    action: 'step-by-step',
    message: actionMessages['step-by-step'],
  },
  'show-scheme': {
    action: 'show-scheme',
    message: actionMessages['show-scheme'],
  },
  'easier-problem': {
    action: 'easier-problem',
    message: actionMessages['easier-problem'],
  },
  'check-answer': {
    action: 'check-answer',
    message: actionMessages['check-answer'],
  },
  'still-confused': {
    action: 'still-confused',
    message: getLumenMessage('not-understood'),
  },
};

export const whyNeedItIntro =
  'Математика помогает понимать мир и принимать решения. Вот где эта тема пригодится в жизни:';
