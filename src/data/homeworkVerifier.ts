/**
 * В пользовательских задачах не подтверждаем ответ без точной проверки.
 * Лучше попросить проверить рассуждение, чем дать неверное решение.
 */

import type { HomeworkType } from './homeworkTypes';

export type VerificationConfidence = 'exact' | 'manual' | 'insufficient';

export interface HomeworkVerification {
  confidence: VerificationConfidence;
  confidenceLabel: string;
  expectedTotal?: number;
  calculationSteps: string[];
  unit?: string;
}

export interface ReasoningInput {
  question: string;
  numbers: string;
  action: string;
  answer: string;
}

export interface ReasoningEvaluation {
  message: string;
  confidence: VerificationConfidence;
}

const CONFIDENT_PHRASES =
  /^(верно|правильно|ответ верный|решение верное|решение готово|получается точно|отлично,? ответ|всё верно)/i;

const FINAL_ANSWER_ONLY = /^[\d\s.,]+(руб|рубл|кг|км|м|см|мм|%)?\.?$/i;

const ASK_FOR_ANSWER =
  /^(ответ|решение|итог|получилось|получается|\d+\s*(руб|рубл)?\.?)$/i;

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ');
}

function extractNumber(text: string): number | null {
  const match = text.replace(/\s/g, '').match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return null;
  return parseFloat(match[0].replace(',', '.'));
}

function extractAllNumbers(text: string): number[] {
  const matches = text.match(/\d+(?:[.,]\d+)?/g);
  if (!matches) return [];
  return matches.map((m) => parseFloat(m.replace(',', '.')));
}

/** Покупки: «3 тетради по 45 рублей»
 * @example «Маша купила 3 тетради по 45 рублей и 2 ручки по 30 рублей» → 3×45 + 2×30 = 195
 */
function parsePurchases(condition: string): HomeworkVerification | null {
  const pattern =
    /(\d+)\s+(?:\S+\s+){0,3}по\s+(\d+)\s*(?:руб|р\.?|рубл)/gi;
  const items: { qty: number; price: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(condition)) !== null) {
    items.push({ qty: parseInt(match[1], 10), price: parseInt(match[2], 10) });
  }

  if (items.length === 0) return null;

  const steps: string[] = [];
  let total = 0;
  for (const { qty, price } of items) {
    const sub = qty * price;
    steps.push(`${qty} × ${price} = ${sub}`);
    total += sub;
  }
  if (items.length > 1) {
    steps.push(steps.map((s) => s.split('=')[1]?.trim()).join(' + ') + ` = ${total}`);
  }

  return {
    confidence: 'exact',
    confidenceLabel: 'можно проверить точно',
    expectedTotal: total,
    calculationSteps: steps,
    unit: 'руб',
  };
}

/** Движение: скорость × время */
function parseMotion(condition: string): HomeworkVerification | null {
  const t = normalize(condition);
  const speedMatch = t.match(/(\d+(?:[.,]\d+)?)\s*(?:км\/ч|км\/час|м\/с|м\/сек|км в час)/);
  const timeMatch = t.match(/(\d+(?:[.,]\d+)?)\s*(?:час|ч\.?|мин|минут|сек)/);

  if (!speedMatch || !timeMatch) return null;

  const speed = parseFloat(speedMatch[1].replace(',', '.'));
  const time = parseFloat(timeMatch[1].replace(',', '.'));
  const distance = speed * time;

  return {
    confidence: 'exact',
    confidenceLabel: 'можно проверить точно',
    expectedTotal: distance,
    calculationSteps: [`${speed} × ${time} = ${distance}`],
    unit: 'км',
  };
}

/** Проценты: цена и скидка */
function parsePercent(condition: string): HomeworkVerification | null {
  const t = normalize(condition);
  const priceMatch = t.match(/(\d+(?:[.,]\d+)?)\s*(?:руб|р\.?|рубл)/);
  const percentMatch = t.match(/(\d+(?:[.,]\d+)?)\s*%/);

  if (!priceMatch || !percentMatch) return null;

  const price = parseFloat(priceMatch[1].replace(',', '.'));
  const pct = parseFloat(percentMatch[1].replace(',', '.'));
  const discount = (price * pct) / 100;
  const newPrice = price - discount;

  const isDiscount = /скидк|дешевл|уменьш|меньш/.test(t);

  return {
    confidence: 'exact',
    confidenceLabel: 'можно проверить точно',
    expectedTotal: isDiscount ? newPrice : discount,
    calculationSteps: [
      `Скидка: ${price} × ${pct} / 100 = ${discount}`,
      `Новая цена: ${price} − ${discount} = ${newPrice}`,
    ],
    unit: 'руб',
  };
}

/** Площадь: длина × ширина */
function parseArea(condition: string): HomeworkVerification | null {
  const t = normalize(condition);
  const dims = t.match(/(\d+(?:[.,]\d+)?)\s*(?:м|см|мм|метр)/g);
  if (!dims || dims.length < 2) return null;

  const nums = dims.slice(0, 2).map((d) => parseFloat(d.match(/\d+(?:[.,]\d+)?/)![0].replace(',', '.')));
  const area = nums[0] * nums[1];

  return {
    confidence: 'exact',
    confidenceLabel: 'можно проверить точно',
    expectedTotal: area,
    calculationSteps: [`${nums[0]} × ${nums[1]} = ${area}`],
    unit: 'м²',
  };
}

export function verifyHomeworkCondition(
  condition: string,
  type: HomeworkType,
): HomeworkVerification {
  const parsers: Partial<Record<HomeworkType, () => HomeworkVerification | null>> = {
    purchases: () => parsePurchases(condition),
    motion: () => parseMotion(condition),
    percent: () => parsePercent(condition),
    area: () => parseArea(condition),
  };

  const parsed = parsers[type]?.() ?? null;
  if (parsed) return parsed;

  const hasNumbers = extractAllNumbers(condition).length >= 2;
  if (hasNumbers) {
    return {
      confidence: 'manual',
      confidenceLabel: 'нужна ручная проверка',
      calculationSteps: [],
    };
  }

  return {
    confidence: 'insufficient',
    confidenceLabel: 'недостаточно данных',
    calculationSteps: [],
  };
}

export function getConfidenceHint(confidence: VerificationConfidence): string {
  switch (confidence) {
    case 'exact':
      return 'Для этой задачи можно проверить вычисления. Но сначала разберём ход решения — не спеши с ответом.';
    case 'manual':
      return 'Я могу помочь проверить рассуждение, но не буду утверждать итоговый ответ без точного разбора.';
    case 'insufficient':
      return 'Я не уверен, что задача распознана полностью. Давай проверим условие и данные вместе.';
  }
}

export function isConfidentPhrase(text: string): boolean {
  return CONFIDENT_PHRASES.test(normalize(text));
}

export function looksLikeFinalAnswerOnly(text: string): boolean {
  const trimmed = text.trim();
  return FINAL_ANSWER_ONLY.test(trimmed) || ASK_FOR_ANSWER.test(normalize(trimmed));
}

export function getNoConfirmAnswerMessage(): string {
  return 'Я не буду просто подтверждать ответ. Давай проверим ход решения: какие данные ты использовал и какое действие выбрал?';
}

export function getCautiousAcceptMessage(stepIndex: number): string {
  const messages: Record<number, string> = {
    0: 'Хорошо. Ты описал, о чём задача — это важный первый шаг.',
    1: 'Хорошо. Ты перечислил данные — давай проверим, все ли числа из условия учтены.',
    2: 'Похоже, ты нашёл главный вопрос. Проверь: он совпадает с концом условия?',
    3: 'Хорошо. Числа отмечены — они помогут выбрать действие.',
    4: 'Логично. Действие выбрано — давай проверим, подходит ли оно к вопросу задачи.',
    5: 'Ты записал ход решения. Теперь важно проверить, а не просто получить число.',
    6: 'Хорошо. Ты прошёл проверку — сравни ответ с вопросом задачи ещё раз сам.',
  };
  return messages[stepIndex] ?? 'Хороший шаг. Можно двигаться дальше — но проверяй себя.';
}

export function getVerificationStepQuestions(): string[] {
  return [
    'Ответ отвечает именно на вопрос задачи?',
    'Все данные из условия использованы правильно?',
    'Единицы измерения подходят?',
    'Можно ли прикинуть ответ устно?',
    'Не получился ли ответ слишком большим или слишком маленьким?',
  ];
}

export function evaluateReasoning(
  condition: string,
  type: HomeworkType,
  input: ReasoningInput,
): ReasoningEvaluation {
  const verification = verifyHomeworkCondition(condition, type);
  const { question, numbers, action, answer } = input;

  if (!question.trim() || !numbers.trim() || !action.trim() || !answer.trim()) {
    return {
      confidence: verification.confidence,
      message:
        'Заполни все поля: что нужно найти, какие числа использовал, какое действие и какой ответ получил.',
    };
  }

  if (looksLikeFinalAnswerOnly(answer) && !action.trim()) {
    return {
      confidence: verification.confidence,
      message: getNoConfirmAnswerMessage(),
    };
  }

  const userAnswerNum = extractNumber(answer);
  const parts = [
    `Вопрос: «${question.trim()}»`,
    `Числа: ${numbers.trim()}`,
    `Действие: ${action.trim()}`,
    `Ответ: ${answer.trim()}`,
  ];

  if (verification.confidence === 'exact' && verification.expectedTotal != null && userAnswerNum != null) {
    const diff = Math.abs(userAnswerNum - verification.expectedTotal);
    const stepsText = verification.calculationSteps.join('; ');
    if (diff < 0.01) {
      return {
        confidence: 'exact',
        message: `Связка вопрос → данные → действие → ответ выглядит согласованной. По расчёту (${stepsText}) похоже на ${verification.expectedTotal}${verification.unit ? ' ' + verification.unit : ''}. Давай проверим ответ ещё раз: подходит ли он к вопросу задачи и не потеряли ли мы данные?`,
      };
    }
    return {
      confidence: 'exact',
      message: `Ты описал ход решения. По условию (${stepsText}) ожидается около ${verification.expectedTotal}${verification.unit ? ' ' + verification.unit : ''}, а у тебя ${userAnswerNum}. Нужно уточнить: все ли данные учтены и верно ли выбрано действие? ${parts.join('. ')}`,
    };
  }

  if (verification.confidence === 'manual') {
    return {
      confidence: 'manual',
      message: `Я могу помочь проверить рассуждение, но не буду утверждать итоговый ответ без точного разбора. Проверь: ${parts.join('. ')}. Давай проверим ответ ещё раз: подходит ли он к вопросу задачи?`,
    };
  }

  return {
    confidence: 'insufficient',
    message: `Я не уверен, что задача распознана полностью. Проверь связку: ${parts.join('. ')}. Нужно уточнить условие или перепроверить числа.`,
  };
}

export function evaluateSolutionStep(
  answer: string,
  condition: string,
  type: HomeworkType,
): { accepted: boolean; message: string } {
  const verification = verifyHomeworkCondition(condition, type);

  if (looksLikeFinalAnswerOnly(answer)) {
    return { accepted: false, message: getNoConfirmAnswerMessage() };
  }

  if (isConfidentPhrase(answer)) {
    return {
      accepted: false,
      message: 'Я не буду просто подтверждать ответ. Опиши ход: какие числа и какое действие ты использовал.',
    };
  }

  const userNum = extractNumber(answer);
  if (userNum != null && verification.confidence === 'exact' && verification.expectedTotal != null) {
    const steps = verification.calculationSteps.join('; ');
    return {
      accepted: true,
      message: `Ты записал решение. По условию можно прикинуть: ${steps}. Сравни свой результат с этим — совпадает? Если да, переходи к проверке. Если нет — пересмотри действие.`,
    };
  }

  return {
    accepted: true,
    message: getCautiousAcceptMessage(5),
  };
}

export function evaluateVerificationStep(
  answer: string,
  condition: string,
  type: HomeworkType,
): { accepted: boolean; message: string } {
  const verification = verifyHomeworkCondition(condition, type);
  const checklist = getVerificationStepQuestions().join(' ');

  if (looksLikeFinalAnswerOnly(answer)) {
    if (verification.confidence === 'exact' && verification.expectedTotal != null) {
      const userNum = extractNumber(answer);
      if (userNum != null && Math.abs(userNum - verification.expectedTotal) < 0.01) {
        return {
          accepted: true,
          message: `Похоже, ответ ${userNum}${verification.unit ? ' ' + verification.unit : ''} согласуется с расчётом (${verification.calculationSteps.join('; ')}). Но обязательно проверь сам: ${checklist}`,
        };
      }
    }
    return { accepted: false, message: getNoConfirmAnswerMessage() };
  }

  if (answer.trim().length < 15) {
    return {
      accepted: false,
      message: `Ответь на вопросы проверки: ${checklist}`,
    };
  }

  return {
    accepted: true,
    message: `Хорошо, ты прошёл проверку рассуждения. ${verification.confidence === 'exact' ? 'Расчёт можно сверить с условием.' : 'Перепроверь итог сам или с учителем.'} ${getConfidenceHint(verification.confidence)}`,
  };
}
