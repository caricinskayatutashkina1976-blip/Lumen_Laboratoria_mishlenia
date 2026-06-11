export type TextAnswerResult = 'exact' | 'close' | 'wrong';

export interface TextAnswerEvaluation {
  result: TextAnswerResult;
  message: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/ё/g, 'e');
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(/[\s,.;:!?\-+×=()]+/)
    .filter((token) => token.length > 1);
}

function containsKeyword(text: string, keyword: string): boolean {
  const normalized = normalize(text);
  const key = normalize(keyword);
  return normalized.includes(key) || key.includes(normalized);
}

function overlapScore(input: string, candidate: string): number {
  const inputTokens = tokenize(input);
  const candidateTokens = tokenize(candidate);
  if (inputTokens.length === 0 || candidateTokens.length === 0) return 0;

  const matches = inputTokens.filter((token) =>
    candidateTokens.some(
      (candidateToken) =>
        candidateToken.includes(token) || token.includes(candidateToken),
    ),
  );

  return matches.length / Math.max(inputTokens.length, candidateTokens.length);
}

export function evaluateTextAnswer(
  input: string,
  expected?: string,
  acceptedAnswers: string[] = [],
  acceptedKeywords: string[] = [],
): TextAnswerEvaluation {
  const trimmed = input.trim();
  if (!trimmed) {
    return { result: 'wrong', message: 'Запиши ответ своими словами — даже коротко.' };
  }

  const normalized = normalize(trimmed);
  const candidates = [expected, ...acceptedAnswers].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const candidateNorm = normalize(candidate);
    if (
      normalized === candidateNorm ||
      normalized.includes(candidateNorm) ||
      candidateNorm.includes(normalized)
    ) {
      return { result: 'exact', message: 'Верно. Ты сформулировал главное точно.' };
    }
  }

  for (const keyword of acceptedKeywords) {
    if (containsKeyword(trimmed, keyword)) {
      const precise = expected ?? candidates[0] ?? 'нужный ответ';
      return {
        result: 'close',
        message: `Смысл ты понял. Можно сказать точнее: ${precise}.`,
      };
    }
  }

  let bestScore = 0;
  let bestCandidate = expected ?? candidates[0];

  for (const candidate of candidates) {
    const score = overlapScore(trimmed, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  if (bestScore >= 0.55) {
    return {
      result: 'close',
      message: `Смысл ты понял. Можно сказать точнее: ${bestCandidate}.`,
    };
  }

  return {
    result: 'wrong',
    message: 'Пока формулировка не совпадает с главным вопросом задачи. Перечитай условие.',
  };
}
