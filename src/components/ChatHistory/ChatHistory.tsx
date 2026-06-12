import type { ChatMessage } from '../LumenChat/LumenChat';

interface ChatHistoryProps {
  messages: ChatMessage[];
  studentLabel?: string;
  lumenLabel?: string;
}

export function ChatHistory({
  messages,
  studentLabel = 'Ученик',
  lumenLabel = 'Люмен',
}: ChatHistoryProps) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`rounded-xl px-4 py-3 ${
            msg.role === 'student'
              ? 'ml-0 border border-lumen-silver-light bg-lumen-bg sm:ml-4'
              : 'mr-0 border border-lumen-teal/20 bg-lumen-teal-soft/25 sm:mr-4'
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-lumen-silver">
            {msg.role === 'student' ? studentLabel : lumenLabel}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">{msg.text}</p>
        </div>
      ))}
    </div>
  );
}
