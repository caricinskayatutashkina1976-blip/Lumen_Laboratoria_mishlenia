export interface ProblemChatContext {
  title: string;
  problemText: string;
  lifeContext: string;
  commonMistake?: string;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/ё/g, 'е');
}

export function getGeneralLumenResponse(question: string): string {
  const q = normalize(question);
  if (!q) {
    return 'Сначала напиши вопрос или то, что непонятно.';
  }

  if (/действи|слож|вычест|умнож|раздел|плюс|минус/.test(q)) {
    return 'Чтобы выбрать действие, нужно понять связь между числами. Если одинаковое число повторяется несколько раз — часто помогает умножение. Если нужно найти остаток — вычитание. Если делим поровну — деление.';
  }

  if (/не понял|не понимаю|объясни проще|не ясно|запутал/.test(q)) {
    return 'Ничего страшного. Давай проще: сначала найдём, что известно, потом — что нужно найти.';
  }

  if (/домашн|домашк|задач.*школ|из школ/.test(q)) {
    return 'Напиши условие задачи в разделе Домашка. Я помогу разобрать её по шагам.';
  }

  if (/провер|ответ/.test(q)) {
    return 'Напиши свой ответ и коротко объясни, как рассуждал. Я помогу проверить ход мысли.';
  }

  if (/что известн|данн|услови/.test(q)) {
    return 'Прочитай условие ещё раз и выпиши все числа. Подпиши, что каждое число означает.';
  }

  if (/что найти|главн|вопрос/.test(q)) {
    return 'Посмотри на конец условия — там обычно спрятан главный вопрос. Сформулируй его своими словами.';
  }

  return 'Я пока не понял вопрос точно. Попробуй написать, на каком шаге ты остановился.';
}

export function getProblemLumenResponse(question: string, context: ProblemChatContext): string {
  const q = normalize(question);
  if (!q) {
    return 'Напиши, что именно непонятно в этой задаче — условие, действие или ответ.';
  }

  if (/услови|данн|известн|числ|выпис/.test(q)) {
    return `Перечитай условие задачи «${context.title}». Выпиши все числа и подпиши, что каждое означает. Это поможет увидеть картину целиком.`;
  }

  if (/действи|слож|вычест|умнож|раздел|выбрать/.test(q)) {
    return 'Чтобы выбрать действие, посмотри на связь между числами. Сначала пойми, что нужно найти, потом подумай: числа нужно собрать вместе, сравнить, повторить несколько раз или разделить поровну?';
  }

  if (/ответ|сколько|результат|получил/.test(q)) {
    return 'Сначала запиши ход решения по шагам — без спешки. Когда будет видна логика, ответ появится сам. Я не дам готовый ответ сразу, но помогу проверить твой путь.';
  }

  if (/ошиб|неправильн|не сход|застрял|не получ/.test(q)) {
    return 'Ошибка — это подсказка. Вернись к шагу, где ты впервые запутался: условие, главный вопрос или выбор действия. Разберём этот шаг спокойно.';
  }

  if (/не понял|объясни|проще/.test(q)) {
    return `Это задача про ${context.lifeContext}. ${context.commonMistake ? `Частая ошибка здесь: ${context.commonMistake}. ` : ''}Давай по шагам: сначала пойми историю, потом найди числа.`;
  }

  return getGeneralLumenResponse(question);
}

export function getTopicUnderstandingResponse(answer: string): string {
  const trimmed = answer.trim();
  if (!trimmed) {
    return 'Сначала напиши свой ответ. Даже короткий ответ поможет понять, что уже ясно.';
  }
  if (trimmed.length > 20) {
    return 'Хорошо. Ты попробовал объяснить своими словами — это важный шаг. Теперь можно закрепить тему на задаче.';
  }
  return 'Попробуй добавить чуть больше: о чём эта тема и что нужно делать сначала.';
}

export function getTrainingExplanationResponse(explanation: string): string | null {
  if (!explanation.trim()) return null;
  return 'Хорошо, ты объяснил ход мысли. Важно не только выбрать ответ, но и понять почему.';
}

export function getStepTextAnswerFeedback(
  answer: string,
  result: 'empty' | 'short' | 'exact' | 'close' | 'wrong',
): string {
  switch (result) {
    case 'empty':
      return 'Сначала попробуй написать ответ. Даже короткий ответ поможет понять, что уже ясно.';
    case 'short':
      return 'Попробуй добавить чуть больше: что ты нашёл и почему.';
    case 'exact':
    case 'close':
      return 'Смысл верный. Теперь проверь, похож ли ответ на правду.';
    case 'wrong':
      return 'Похоже, здесь нужно ещё раз посмотреть на условие. Давай вернёмся к нужному шагу.';
    default:
      return getGeneralLumenResponse(answer);
  }
}

export function getFinalAnswerFeedback(answer: string, isMatch: boolean): string {
  const trimmed = answer.trim();
  if (!trimmed) {
    return 'Сначала попробуй написать ответ. Даже короткий ответ поможет понять, что уже ясно.';
  }
  if (trimmed.length < 4) {
    return 'Попробуй добавить чуть больше: что ты нашёл и почему.';
  }
  if (isMatch) {
    return 'Смысл верный. Теперь проверь, похож ли ответ на правду.';
  }
  return 'Похоже, здесь нужно ещё раз посмотреть на условие. Давай вернёмся к нужному шагу.';
}
