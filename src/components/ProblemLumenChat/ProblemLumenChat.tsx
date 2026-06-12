import { useCallback } from 'react';
import { LumenChat } from '../LumenChat/LumenChat';
import {
  getProblemLumenResponse,
  type ProblemChatContext,
} from '../../data/lumenChatResponses';

interface ProblemLumenChatProps {
  context: ProblemChatContext;
}

export function ProblemLumenChat({ context }: ProblemLumenChatProps) {
  const getResponse = useCallback(
    (question: string) => getProblemLumenResponse(question, context),
    [context],
  );

  return (
    <LumenChat
      title="Спроси Люмена по этой задаче"
      placeholder="Например: я не понимаю, какое действие выбрать…"
      buttonLabel="Спросить"
      getResponse={getResponse}
    />
  );
}
