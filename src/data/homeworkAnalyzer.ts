import { verifyHomeworkCondition, type HomeworkVerification } from './homeworkVerifier';
import type { HomeworkType } from './homeworkTypes';

export type { HomeworkType, HomeworkVerification };

export interface HomeworkStep {
  title: string;
  content: string;
}

const TYPE_LABELS: Record<HomeworkType, string> = {
  purchases: 'Задача про покупки',
  motion: 'Задача на движение',
  percent: 'Задача про проценты',
  area: 'Задача про площадь',
  text: 'Текстовая задача',
};

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/ё/g, 'е');
}

export function detectHomeworkType(text: string): HomeworkType {
  const t = normalize(text);

  if (/скорост|время|расстояни|км\/|км в|автобус|велосипед|поезд/.test(t)) {
    return 'motion';
  }
  if (/процент|скидк|%/.test(t)) {
    return 'percent';
  }
  if (/площад|периметр|длин|ширин|комнат|коврик|огород/.test(t)) {
    return 'area';
  }
  if (/купил|цена|рубл|магазин|потратил|стоимост/.test(t)) {
    return 'purchases';
  }

  return 'text';
}

const TYPE_HINTS: Record<
  HomeworkType,
  { about: string; known: string; find: string; action: string; firstStep: string }
> = {
  purchases: {
    about: 'Похоже, это задача про покупки и деньги.',
    known: 'Найди в условии: что купили, сколько штук и какая цена. Выпиши каждое число отдельно.',
    find: 'Определи главный вопрос: сколько всего потратили, сколько осталось или сколько стоит одна вещь?',
    action:
      'Если одна цена повторяется несколько раз — подумай про умножение. Если нужно собрать разные покупки — про сложение.',
    firstStep:
      'Попробуй сначала посчитать стоимость одной группы покупок, например всех одинаковых товаров.',
  },
  motion: {
    about: 'Похоже, это задача на движение.',
    known: 'Выпиши скорость, время и расстояние — что из этого дано в условии.',
    find: 'Что нужно найти: расстояние, время или скорость?',
    action: 'Вспомни связь: расстояние = скорость × время. Подумай, какое из трёх неизвестно.',
    firstStep: 'Запиши формулу и подставь известные числа. Пока не считай — просто разложи данные.',
  },
  percent: {
    about: 'Похоже, это задача про проценты или скидку.',
    known: 'Найди исходную цену и процент. Пойми: нужно найти часть от числа или само число по части?',
    find: 'Что спрашивают: размер скидки, итоговую цену или исходную стоимость?',
    action: 'Процент — это часть от 100. Подумай: нужно найти долю или восстановить целое.',
    firstStep: 'Сначала определи, 100% — это какое число в задаче.',
  },
  area: {
    about: 'Похоже, это задача про площадь или размеры фигуры.',
    known: 'Выпиши длину, ширину и другие размеры. Пойми, какая фигура в задаче.',
    find: 'Нужно найти площадь, периметр или недостающий размер?',
    action: 'Для прямоугольника площадь = длина × ширина. Периметр — это обход по краю.',
    firstStep: 'Нарисуй схему фигуры и подпиши стороны. Это поможет увидеть, что искать.',
  },
  text: {
    about: 'Это текстовая задача — разберём её по шагам.',
    known: 'Прочитай условие два раза. Выпиши все числа и подпиши, что они означают.',
    find: 'Найди в конце условия главный вопрос — что именно нужно узнать.',
    action: 'Подумай о связи между числами: собрать, сравнить, повторить или разделить.',
    firstStep: 'Сформулируй своими словами: о чём задача и что нужно найти.',
  },
};

export const GUIDING_QUESTIONS = [
  'Что известно?',
  'Что нужно найти?',
  'Какие числа помогут ответить на вопрос?',
  'Какое действие ты бы выбрал?',
];

export function buildHomeworkBreakdown(text: string): {
  type: HomeworkType;
  typeLabel: string;
  steps: HomeworkStep[];
  guidingQuestions: string[];
  verification: HomeworkVerification;
} {
  const type = detectHomeworkType(text);
  const hints = TYPE_HINTS[type];
  const verification = verifyHomeworkCondition(text, type);

  return {
    type,
    typeLabel: TYPE_LABELS[type],
    verification,
    steps: [
      { title: 'Сначала найдём, о чём задача', content: hints.about },
      { title: 'Теперь выпишем, что известно', content: hints.known },
      { title: 'Теперь найдём главный вопрос', content: hints.find },
      { title: 'Подумаем, какое действие может подойти', content: hints.action },
      { title: 'Попробуй предложить первый шаг решения', content: hints.firstStep },
    ],
    guidingQuestions: GUIDING_QUESTIONS,
  };
}
