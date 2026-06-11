import type { LumenAction, LumenResponse } from '../types';

export const defaultGreeting =
  'Привет. Я Люмен. Давай разбираться спокойно и по шагам.';

export const lumenResponses: Record<LumenAction, LumenResponse> = {
  'explain-simpler': {
    action: 'explain-simpler',
    message:
      'Ничего страшного. Сейчас объясню проще: представь, что задача — это короткая история. Сначала найдём, о чём она.',
  },
  'show-example': {
    action: 'show-example',
    message:
      'Вот простой пример: если ехать 50 км/ч два часа, путь = 50 × 2 = 100 км. Та же логика работает и в твоей задаче.',
  },
  'step-by-step': {
    action: 'step-by-step',
    message:
      'Сначала найдём, что известно. Потом поймём, что нужно найти. Двигаемся по одному шагу — не перепрыгивай.',
  },
  'show-scheme': {
    action: 'show-scheme',
    message:
      'Схема: [Скорость] ———→ [Время] ———→ [Расстояние]. Если знаешь два значения, третье можно найти по формуле S = v × t.',
  },
  'easier-problem': {
    action: 'easier-problem',
    message:
      'Давай задачу полегче: велосипедист едет 10 км/ч. Сколько он проедет за 1 час? Это та же идея, но с простыми числами.',
  },
  'check-answer': {
    action: 'check-answer',
    message:
      'Запиши свой ответ и единицы измерения. Я проверю логику: правильно ли ты связал скорость и время?',
  },
  'still-confused': {
    action: 'still-confused',
    message:
      'Ошибка — это не провал. Это место, которое нужно разобрать. Давай вернёмся к шагу «Что известно?» и прочитаем условие ещё раз.',
  },
};

export const whyNeedItIntro =
  'Учёба нужна не только для оценок. Она тренирует мышление. Вот где эта тема пригодится в жизни:';
