import type { ErrorStats, ErrorType, NextStepRecommendationData, TrainingSkill } from '../types';

const ERROR_TO_SKILL: Partial<Record<ErrorType, TrainingSkill>> = {
  'missed-main-question': 'find-question',
  'rushed-to-solution': 'find-question',
  'misunderstood-condition': 'find-data',
  'confused-data': 'find-data',
  'wrong-action': 'choose-operation',
  'calculation-error': 'calculate',
  'unchecked-answer': 'check-answer',
};

const SKILL_RECOMMENDATIONS: Record<
  TrainingSkill,
  Omit<NextStepRecommendationData, 'summary' | 'skill'>
> = {
  'find-question': {
    title: 'Потренируем главный вопрос',
    text: 'Ты уже умеешь читать условие. Теперь укрепим навык: находить, что именно нужно узнать.',
    primaryLabel: 'Тренировать вопрос задачи',
    primaryLink: '/training/find-question',
    secondaryLabel: 'Вернуться к теме',
    secondaryLink: '/map',
  },
  'find-data': {
    title: 'Потренируем данные',
    text: 'Важно аккуратно выписать числа из условия и понять, что каждое из них означает.',
    primaryLabel: 'Тренировать данные',
    primaryLink: '/training/find-data',
    secondaryLabel: 'Вернуться к теме',
    secondaryLink: '/map',
  },
  'choose-operation': {
    title: 'Разберём выбор действия',
    text: 'Данные ты находишь хорошо. Сейчас важно понять, какое действие подходит и почему.',
    primaryLabel: 'Тренировать выбор действия',
    primaryLink: '/training/choose-operation',
    secondaryLabel: 'Показать пример',
    secondaryLink: '/training/choose-operation',
  },
  calculate: {
    title: 'Укрепим счёт',
    text: 'Ход решения был верный. Осталось внимательнее пересчитать.',
    primaryLabel: 'Дать пример на вычисление',
    primaryLink: '/training/calculate',
    secondaryLabel: 'Повторить шаг решения',
    secondaryLink: '/map',
  },
  'check-answer': {
    title: 'Научимся проверять ответ',
    text: 'Ответ получен — но стоит убедиться, что он имеет смысл. Это последний важный шаг.',
    primaryLabel: 'Тренировать проверку',
    primaryLink: '/training/check-answer',
    secondaryLabel: 'Вернуться к теме',
    secondaryLink: '/map',
  },
};

function getSkillCounts(stats: ErrorStats) {
  return {
    'find-question': stats.missedQuestionCount + stats.rushedCount,
    'find-data': stats.confusedDataCount + stats.misunderstoodConditionCount,
    'choose-operation': stats.wrongActionCount,
    calculate: stats.calculationErrorCount,
    'check-answer': stats.uncheckedAnswerCount,
  };
}

export function getPrimaryWeakSkill(stats: ErrorStats): TrainingSkill | null {
  const counts = getSkillCounts(stats);
  const entries = Object.entries(counts) as [TrainingSkill, number][];
  const sorted = entries.filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? null;
}

export function getTotalErrorCount(stats: ErrorStats): number {
  return (
    stats.misunderstoodConditionCount +
    stats.missedQuestionCount +
    stats.confusedDataCount +
    stats.wrongActionCount +
    stats.calculationErrorCount +
    stats.uncheckedAnswerCount +
    stats.rushedCount
  );
}

export function getRecommendationForSkill(
  skill: TrainingSkill,
  context: 'after-fix' | 'after-problem' | 'profile' | 'lesson' = 'profile',
  topicSlug?: string,
): NextStepRecommendationData {
  const base = SKILL_RECOMMENDATIONS[skill];
  const topicLink = topicSlug ? `/lesson/${topicSlug}` : '/map';

  const summaries: Record<typeof context, string> = {
    'after-fix': 'Ты исправил ошибку. Вот что поможет закрепить навык.',
    'after-problem': 'Задача разобрана. Можно укрепить навык или двигаться дальше.',
    profile: 'Рекомендация Люмена на основе твоих тренировок.',
    lesson: 'По этой теме есть навык, который стоит потренировать.',
  };

  return {
    summary: summaries[context],
    skill,
    title: base.title,
    text: base.text,
    primaryLabel: base.primaryLabel,
    primaryLink: base.primaryLink,
    secondaryLabel:
      skill === 'choose-operation' && context === 'after-fix'
        ? 'Показать пример'
        : base.secondaryLabel,
    secondaryLink:
      base.secondaryLabel === 'Вернуться к теме' ? topicLink : base.secondaryLink,
  };
}

export function getRecommendationFromError(
  errorType: ErrorType,
  context: 'after-fix' | 'after-problem' = 'after-fix',
  topicSlug?: string,
): NextStepRecommendationData | null {
  const skill = ERROR_TO_SKILL[errorType];
  if (!skill) return null;
  return getRecommendationForSkill(skill, context, topicSlug);
}

export function getAdaptiveRecommendation(
  stats: ErrorStats,
  context: 'after-fix' | 'after-problem' | 'profile' | 'lesson' = 'profile',
  options?: { lastErrorType?: ErrorType; topicSlug?: string },
): NextStepRecommendationData {
  if (options?.lastErrorType) {
    const fromError = getRecommendationFromError(
      options.lastErrorType,
      context === 'profile' ? 'after-fix' : context,
      options.topicSlug,
    );
    if (fromError) return fromError;
  }

  const totalErrors = getTotalErrorCount(stats);
  const weakSkill = getPrimaryWeakSkill(stats);

  if (totalErrors === 0 || !weakSkill) {
    return {
      summary: 'Ты хорошо продвигаешься.',
      title: 'Можно двигаться дальше',
      text: 'Ошибок пока немного. Можно переходить к следующей теме или взять задачу посложнее.',
      primaryLabel: 'Открыть карту тем',
      primaryLink: '/map',
      secondaryLabel: 'На главную',
      secondaryLink: '/',
    };
  }

  if (context === 'profile') {
    const profileTexts: Partial<Record<TrainingSkill, string>> = {
      'choose-operation':
        'Сейчас лучше потренировать выбор действия. Это поможет решать текстовые задачи увереннее.',
      calculate: 'Ты понимаешь ход решения, но стоит укрепить счёт.',
      'find-question':
        'Стоит потренировать поиск главного вопроса — это основа любой задачи.',
      'find-data': 'Полезно укрепить навык работы с данными из условия.',
      'check-answer': 'Попробуй потренировать проверку ответа — это финальный важный шаг.',
    };

    const rec = getRecommendationForSkill(weakSkill, 'profile', options?.topicSlug);
    return {
      ...rec,
      text: profileTexts[weakSkill] ?? rec.text,
    };
  }

  return getRecommendationForSkill(weakSkill, context, options?.topicSlug);
}

export function errorTypeToSkill(errorType: ErrorType): TrainingSkill | null {
  return ERROR_TO_SKILL[errorType] ?? null;
}
