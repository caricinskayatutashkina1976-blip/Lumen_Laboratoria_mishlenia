import { useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'student' | 'lumen';
  text: string;
}

interface LumenChatProps {
  title?: string;
  placeholder?: string;
  buttonLabel?: string;
  getResponse: (question: string) => string;
  maxMessages?: number;
  className?: string;
}

export function LumenChat({
  title = 'Спроси Люмена',
  placeholder = 'Напиши, что непонятно…',
  buttonLabel = 'Спросить Люмена',
  getResponse,
  maxMessages = 5,
  className = '',
}: LumenChatProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handleAsk() {
    const question = input.trim();
    if (!question) return;

    const studentMsg: ChatMessage = {
      id: `s-${Date.now()}`,
      role: 'student',
      text: question,
    };
    const lumenMsg: ChatMessage = {
      id: `l-${Date.now()}`,
      role: 'lumen',
      text: getResponse(question),
    };

    setMessages((prev) => {
      const next = [...prev, studentMsg, lumenMsg];
      return next.slice(-maxMessages);
    });
    setInput('');
  }

  return (
    <section className={`lumen-card overflow-hidden ${className}`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue/60 to-lumen-teal/60" />
      <div className="p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">{title}</p>

        {messages.length > 0 && (
          <div className="mt-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl px-4 py-3 ${
                  msg.role === 'student'
                    ? 'ml-4 border border-lumen-silver-light bg-lumen-bg'
                    : 'mr-4 border border-lumen-teal/20 bg-lumen-teal-soft/30'
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-lumen-silver">
                  {msg.role === 'student' ? 'Твой вопрос' : 'Люмен'}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk();
            }}
            placeholder={placeholder}
            className="flex-1 rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3 text-sm text-lumen-graphite outline-none transition-colors focus:border-lumen-teal/50 focus:ring-2 focus:ring-lumen-teal/20"
          />
          <button type="button" onClick={handleAsk} className="lumen-btn-primary shrink-0 text-sm">
            {buttonLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
