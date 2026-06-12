import type {
  ErrorStats,
  ErrorType,
  GradeProgressMap,
  ProblemProgressEntry,
  ProblemStatus,
  StoredProgress,
  TrainingProgress,
  TrainingSkill,
} from '../types';
import {
  activeTopicIdsGrade5,
  activeTopicIdsGrade6,
  reviewTopicIds,
} from '../data/topics';

const STORAGE_KEY = 'lumen-laboratoria-progress';

export const DEFAULT_ERROR_STATS: ErrorStats = {
  misunderstoodConditionCount: 0,
  missedQuestionCount: 0,
  confusedDataCount: 0,
  wrongActionCount: 0,
  calculationErrorCount: 0,
  uncheckedAnswerCount: 0,
  rushedCount: 0,
  selfFixedCount: 0,
  selfFixedTypes: [],
};

export const DEFAULT_TRAINING_PROGRESS: TrainingProgress = {
  completedSkills: [],
  exercisesCompleted: 0,
  skillAttempts: {},
};

const DEFAULT_PROGRESS: StoredProgress = {
  studentName: 'Алексей',
  selectedTopics: [],
  completedLessons: [],
  solvedProblems: [],
  unlockedAchievements: ['first-step'],
  topicProgress: {},
  overallProgress: 0,
  completedMissions: [],
  currentMissionId: 'mission-find-question',
  lastVisit: new Date().toISOString(),
  errorStats: DEFAULT_ERROR_STATS,
  trainingProgress: DEFAULT_TRAINING_PROGRESS,
  problemProgress: {},
};

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, lastVisit: new Date().toISOString() };

    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return withGradeProgress({
      ...DEFAULT_PROGRESS,
      ...parsed,
      topicProgress: parsed.topicProgress ?? {},
      selectedTopics: parsed.selectedTopics ?? [],
      completedLessons: parsed.completedLessons ?? [],
      solvedProblems: parsed.solvedProblems ?? [],
      unlockedAchievements: parsed.unlockedAchievements ?? ['first-step'],
      completedMissions: parsed.completedMissions ?? [],
      errorStats: { ...DEFAULT_ERROR_STATS, ...parsed.errorStats },
      trainingProgress: {
        ...DEFAULT_TRAINING_PROGRESS,
        ...parsed.trainingProgress,
        completedSkills: parsed.trainingProgress?.completedSkills ?? [],
        skillAttempts: parsed.trainingProgress?.skillAttempts ?? {},
      },
      problemProgress: parsed.problemProgress ?? {},
    });
  } catch {
    return { ...DEFAULT_PROGRESS, lastVisit: new Date().toISOString() };
  }
}

export function saveProgress(progress: StoredProgress): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...progress, lastVisit: new Date().toISOString() }),
    );
  } catch {
    // localStorage may be unavailable
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getTopicProgress(topicId: string, progress: StoredProgress): number {
  return progress.topicProgress[topicId] ?? 0;
}

export function calculateOverallProgress(
  topicProgress: Record<string, number>,
  topicIds: string[],
): number {
  if (topicIds.length === 0) return 0;
  const sum = topicIds.reduce((acc, id) => acc + (topicProgress[id] ?? 0), 0);
  return Math.round(sum / topicIds.length);
}

export function calculateGradeProgressMap(
  topicProgress: Record<string, number>,
): GradeProgressMap {
  return {
    5: calculateOverallProgress(topicProgress, activeTopicIdsGrade5),
    6: calculateOverallProgress(topicProgress, activeTopicIdsGrade6),
    review: calculateOverallProgress(topicProgress, reviewTopicIds),
  };
}

function withGradeProgress(progress: StoredProgress): StoredProgress {
  const gradeProgress = calculateGradeProgressMap(progress.topicProgress);
  return {
    ...progress,
    overallProgress: gradeProgress[5],
    gradeProgress,
  };
}

export function selectTopic(topicId: string, progress: StoredProgress): StoredProgress {
  const selectedTopics = progress.selectedTopics.includes(topicId)
    ? progress.selectedTopics
    : [...progress.selectedTopics, topicId];

  return { ...progress, selectedTopics };
}

export function completeLesson(
  lessonId: string,
  topicId: string,
  progress: StoredProgress,
  _topicIds: string[],
): StoredProgress {
  const completedLessons = progress.completedLessons.includes(lessonId)
    ? progress.completedLessons
    : [...progress.completedLessons, lessonId];

  const current = progress.topicProgress[topicId] ?? 0;
  const topicProgress = {
    ...progress.topicProgress,
    [topicId]: Math.min(100, Math.max(current, 25)),
  };

  return withGradeProgress({
    ...progress,
    completedLessons,
    topicProgress,
  });
}

export function solveProblem(
  problemId: string,
  topicId: string,
  progress: StoredProgress,
  _topicIds: string[],
  increment = 20,
): StoredProgress {
  const solvedProblems = progress.solvedProblems.includes(problemId)
    ? progress.solvedProblems
    : [...progress.solvedProblems, problemId];

  const current = progress.topicProgress[topicId] ?? 0;
  const topicProgress = {
    ...progress.topicProgress,
    [topicId]: Math.min(100, current + increment),
  };

  return withGradeProgress({
    ...progress,
    solvedProblems,
    topicProgress,
  });
}

export function unlockAchievement(
  achievementId: string,
  progress: StoredProgress,
): StoredProgress {
  if (progress.unlockedAchievements.includes(achievementId)) return progress;

  return {
    ...progress,
    unlockedAchievements: [...progress.unlockedAchievements, achievementId],
  };
}

export function setStudentName(name: string, progress: StoredProgress): StoredProgress {
  return { ...progress, studentName: name.trim() || DEFAULT_PROGRESS.studentName };
}

export function completeMission(
  missionId: string,
  progress: StoredProgress,
): StoredProgress {
  const completedMissions = progress.completedMissions.includes(missionId)
    ? progress.completedMissions
    : [...progress.completedMissions, missionId];

  return { ...progress, completedMissions };
}

export function setCurrentMission(
  missionId: string,
  progress: StoredProgress,
): StoredProgress {
  return { ...progress, currentMissionId: missionId };
}

function incrementErrorStat(stats: ErrorStats, type: ErrorType): ErrorStats {
  const next = { ...stats };
  switch (type) {
    case 'misunderstood-condition':
      next.misunderstoodConditionCount += 1;
      break;
    case 'missed-main-question':
      next.missedQuestionCount += 1;
      break;
    case 'confused-data':
      next.confusedDataCount += 1;
      break;
    case 'wrong-action':
      next.wrongActionCount += 1;
      break;
    case 'calculation-error':
      next.calculationErrorCount += 1;
      break;
    case 'unchecked-answer':
      next.uncheckedAnswerCount += 1;
      break;
    case 'rushed-to-solution':
      next.rushedCount += 1;
      break;
  }
  return next;
}

export function recordError(
  errorType: ErrorType,
  progress: StoredProgress,
): StoredProgress {
  return {
    ...progress,
    errorStats: incrementErrorStat(progress.errorStats ?? DEFAULT_ERROR_STATS, errorType),
  };
}

export function recordSelfFix(
  errorType: ErrorType,
  progress: StoredProgress,
): StoredProgress {
  const stats = progress.errorStats ?? DEFAULT_ERROR_STATS;
  const selfFixedTypes = stats.selfFixedTypes.includes(errorType)
    ? stats.selfFixedTypes
    : [...stats.selfFixedTypes, errorType];

  return {
    ...progress,
    errorStats: {
      ...stats,
      selfFixedCount: stats.selfFixedCount + 1,
      selfFixedTypes,
    },
  };
}

const SKILL_ACHIEVEMENTS: Partial<Record<TrainingSkill, string[]>> = {
  'find-question': ['training-found-question'],
  'choose-operation': ['training-chose-action'],
  'check-answer': ['training-checked-answer'],
};

export function completeTrainingSession(
  skill: TrainingSkill,
  correctCount: number,
  totalExercises: number,
  progress: StoredProgress,
): StoredProgress {
  const tp = progress.trainingProgress ?? DEFAULT_TRAINING_PROGRESS;
  const passed = correctCount >= Math.ceil(totalExercises * 0.67);

  const completedSkills = passed && !tp.completedSkills.includes(skill)
    ? [...tp.completedSkills, skill]
    : tp.completedSkills;

  let next: StoredProgress = {
    ...progress,
    trainingProgress: {
      completedSkills,
      exercisesCompleted: tp.exercisesCompleted + correctCount,
      skillAttempts: {
        ...tp.skillAttempts,
        [skill]: (tp.skillAttempts[skill] ?? 0) + 1,
      },
    },
  };

  if (passed) {
    next = unlockAchievement('strengthened-weakness', next);
    const achievementIds = SKILL_ACHIEVEMENTS[skill] ?? [];
    for (const id of achievementIds) {
      next = unlockAchievement(id, next);
    }
  }

  return next;
}

function setProblemEntry(
  progress: StoredProgress,
  problemId: string,
  patch: Partial<ProblemProgressEntry>,
): StoredProgress {
  const current = progress.problemProgress?.[problemId] ?? { status: 'not-started' as ProblemStatus };
  return {
    ...progress,
    problemProgress: {
      ...progress.problemProgress,
      [problemId]: { ...current, ...patch },
    },
  };
}

export function startProblem(problemId: string, progress: StoredProgress): StoredProgress {
  const current = progress.problemProgress?.[problemId];
  if (current?.status === 'solved' || current?.status === 'solved-with-hint') {
    return progress;
  }
  return setProblemEntry(progress, problemId, { status: 'in-progress' });
}

export function markProblemStep(
  problemId: string,
  step: number,
  progress: StoredProgress,
): StoredProgress {
  return setProblemEntry(progress, problemId, { status: 'in-progress', lastStep: step });
}

export function markProblemError(problemId: string, progress: StoredProgress): StoredProgress {
  return setProblemEntry(progress, problemId, {
    status: 'needs-retry',
    hadError: true,
  });
}

export function markProblemHintUsed(problemId: string, progress: StoredProgress): StoredProgress {
  return setProblemEntry(progress, problemId, { usedHint: true });
}

export function markProblemSolved(
  problemId: string,
  progress: StoredProgress,
  usedHint: boolean,
): StoredProgress {
  return setProblemEntry(progress, problemId, {
    status: usedHint ? 'solved-with-hint' : 'solved',
    hadError: progress.problemProgress?.[problemId]?.hadError,
    usedHint: usedHint || progress.problemProgress?.[problemId]?.usedHint,
  });
}

export function setDailyProblem(
  problemId: string,
  progress: StoredProgress,
): StoredProgress {
  return {
    ...progress,
    dailyProblemId: problemId,
    dailyProblemDate: new Date().toISOString().slice(0, 10),
  };
}

export { DEFAULT_PROGRESS, STORAGE_KEY };
