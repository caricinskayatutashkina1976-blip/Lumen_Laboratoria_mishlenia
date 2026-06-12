import { useState } from 'react';
import { getTopicUnderstandingResponse } from '../../data/lumenChatResponses';
import { LumenReply } from '../LumenReply/LumenReply';
import { StudentInputBox } from '../StudentInputBox/StudentInputBox';

export function TopicSelfAnswer() {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCheck() {
    setFeedback(getTopicUnderstandingResponse(answer));
  }

  return (
    <article className="lumen-card border-l-4 border-lumen-blue p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-lumen-graphite">
        Ответь своими словами
      </h3>
      <StudentInputBox
        label="Как ты понял эту тему?"
        placeholder="Напиши коротко своими словами…"
        buttonText="Проверить"
        multiline
        rows={3}
        value={answer}
        onChange={(value) => {
          setAnswer(value);
          setFeedback(null);
        }}
        onSubmit={handleCheck}
        id="topic-self-answer"
        submitOnEnter={false}
      />
      {feedback && (
        <div className="mt-4">
          <LumenReply text={feedback} />
        </div>
      )}
    </article>
  );
}
