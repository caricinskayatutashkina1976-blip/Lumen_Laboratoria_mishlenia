import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ErrorType, NextStepRecommendationData, StoredProgress, TrainingSkill } from '../types';
import { getAdaptiveRecommendation } from '../data/recommendations';
import { getTrainingFocusLabels } from '../data/errorDiagnosis';
import { getTrainingBySkill } from '../data/trainings';
import { achievements as achievementDefs } from '../data/achievements';
import { activeTopicIds, topics } from '../data/topics';
import {
  completeLesson as completeLessonUtil,
  completeMission as completeMissionUtil,
  calculateOverallProgress,
  completeTrainingSession,
  loadProgress,
  saveProgress,
  markProblemError,
  markProblemHintUsed,
  markProblemSolved,
  markProblemStep,
  recordError,
  recordSelfFix,
  selectTopic as selectTopicUtil,
  setDailyProblem,
  setCurrentMission as setCurrentMissionUtil,
  setStudentName as setStudentNameUtil,
  solveProblem as solveProblemUtil,
  startProblem as startProblemUtil,
  unlockAchievement as unlockAchievementUtil,
} from '../utils/progressStorage';
import { getProblemOfDay } from '../data/problemOfDay';

interface ProgressContextValue {
  progress: StoredProgress;
  isAchievementUnlocked: (id: string) => boolean;
  getTopicProgress: (topicId: string) => number;
  isTopicUnlocked: (topicId: string) => boolean;
  selectTopic: (topicId: string) => void;
  completeLesson: (lessonId: string, topicId: string) => void;
  solveProblem: (problemId: string, topicId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  setStudentName: (name: string) => void;
  completeMission: (missionId: string) => void;
  setCurrentMission: (missionId: string) => void;
  recordStepError: (errorType: ErrorType) => void;
  recordErrorSelfFix: (errorType: ErrorType) => void;
  getTrainingFocus: () => string[];
  getLumenRecommendation: (
    context?: 'after-fix' | 'after-problem' | 'profile' | 'lesson',
    options?: { lastErrorType?: ErrorType; topicSlug?: string },
  ) => NextStepRecommendationData;
  completeTraining: (skill: TrainingSkill, correctCount: number) => void;
  startProblemSession: (problemId: string) => void;
  trackProblemStep: (problemId: string, step: number) => void;
  trackProblemError: (problemId: string) => void;
  trackProblemHint: (problemId: string) => void;
  finishProblemSession: (problemId: string, usedHint: boolean) => void;
  getDailyProblem: () => ReturnType<typeof getProblemOfDay>;
  ensureDailyProblem: () => void;
  topicsMastered: number;
  missionsCompleted: number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<StoredProgress>(() => {
    const loaded = loadProgress();
    return {
      ...loaded,
      overallProgress: calculateOverallProgress(loaded.topicProgress, activeTopicIds),
    };
  });

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const isAchievementUnlocked = useCallback(
    (id: string) => progress.unlockedAchievements.includes(id),
    [progress.unlockedAchievements],
  );

  const getTopicProgress = useCallback(
    (topicId: string) => progress.topicProgress[topicId] ?? 0,
    [progress.topicProgress],
  );

  const isTopicUnlocked = useCallback(
    (topicId: string) => {
      const topic = topics.find((t) => t.id === topicId);
      if (!topic) return false;
      if (topic.status === 'soon') return true;
      if (!topic.unlockAfter) return true;
      return getTopicProgress(topic.unlockAfter) >= 30;
    },
    [getTopicProgress],
  );

  const selectTopic = useCallback((topicId: string) => {
    setProgress((prev) => selectTopicUtil(topicId, prev));
  }, []);

  const completeLesson = useCallback((lessonId: string, topicId: string) => {
    setProgress((prev) => {
      const next = completeLessonUtil(lessonId, topicId, prev, activeTopicIds);
      return unlockAchievementUtil('first-step', next);
    });
  }, []);

  const solveProblem = useCallback((problemId: string, topicId: string) => {
    setProgress((prev) => {
      let next = solveProblemUtil(problemId, topicId, prev, activeTopicIds);
      next = unlockAchievementUtil('see-question', next);
      if (next.solvedProblems.length >= 3) {
        next = unlockAchievementUtil('confident-solver', next);
      }
      if (
        topicId === 'motion' &&
        next.solvedProblems.filter((id) => id.startsWith('motion-')).length >= 2
      ) {
        next = unlockAchievementUtil('motion-master', next);
      }
      if (
        topicId === 'fractions' &&
        next.solvedProblems.filter((id) => id.startsWith('fractions-')).length >= 2
      ) {
        next = unlockAchievementUtil('fraction-expert', next);
      }
      return next;
    });
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setProgress((prev) => unlockAchievementUtil(achievementId, prev));
  }, []);

  const setStudentName = useCallback((name: string) => {
    setProgress((prev) => setStudentNameUtil(name, prev));
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setProgress((prev) => completeMissionUtil(missionId, prev));
  }, []);

  const setCurrentMission = useCallback((missionId: string) => {
    setProgress((prev) => setCurrentMissionUtil(missionId, prev));
  }, []);

  const recordStepError = useCallback((errorType: ErrorType) => {
    setProgress((prev) => recordError(errorType, prev));
  }, []);

  const recordErrorSelfFix = useCallback((errorType: ErrorType) => {
    setProgress((prev) => {
      let next = recordSelfFix(errorType, prev);
      next = unlockAchievementUtil('fix-error', next);
      return next;
    });
  }, []);

  const getTrainingFocus = useCallback(() => {
    return getTrainingFocusLabels(progress.errorStats ?? {
      misunderstoodConditionCount: 0,
      missedQuestionCount: 0,
      confusedDataCount: 0,
      wrongActionCount: 0,
      calculationErrorCount: 0,
      uncheckedAnswerCount: 0,
      rushedCount: 0,
    });
  }, [progress.errorStats]);

  const getLumenRecommendation = useCallback(
    (
      context: 'after-fix' | 'after-problem' | 'profile' | 'lesson' = 'profile',
      options?: { lastErrorType?: ErrorType; topicSlug?: string },
    ) =>
      getAdaptiveRecommendation(progress.errorStats, context, {
        ...options,
        progress,
      }),
    [progress],
  );

  const completeTraining = useCallback((skill: TrainingSkill, correctCount: number) => {
    const training = getTrainingBySkill(skill);
    const total = training?.exercises.length ?? 3;
    setProgress((prev) => completeTrainingSession(skill, correctCount, total, prev));
  }, []);

  const startProblemSession = useCallback((problemId: string) => {
    setProgress((prev) => startProblemUtil(problemId, prev));
  }, []);

  const trackProblemStep = useCallback((problemId: string, step: number) => {
    setProgress((prev) => markProblemStep(problemId, step, prev));
  }, []);

  const trackProblemError = useCallback((problemId: string) => {
    setProgress((prev) => markProblemError(problemId, prev));
  }, []);

  const trackProblemHint = useCallback((problemId: string) => {
    setProgress((prev) => markProblemHintUsed(problemId, prev));
  }, []);

  const finishProblemSession = useCallback((problemId: string, usedHint: boolean) => {
    setProgress((prev) => markProblemSolved(problemId, prev, usedHint));
  }, []);

  const getDailyProblem = useCallback(() => getProblemOfDay(progress), [progress]);

  const ensureDailyProblem = useCallback(() => {
    setProgress((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      if (prev.dailyProblemDate === today && prev.dailyProblemId) {
        return prev;
      }
      const problem = getProblemOfDay(prev);
      return setDailyProblem(problem.id, prev);
    });
  }, []);

  const topicsMastered = useMemo(
    () =>
      topics.filter(
        (t) =>
          (t.status === 'ready' || t.status === 'in-progress') &&
          getTopicProgress(t.id) >= 70,
      ).length,
    [getTopicProgress],
  );

  const missionsCompleted = progress.completedMissions.length;

  const value: ProgressContextValue = {
    progress,
    isAchievementUnlocked,
    getTopicProgress,
    isTopicUnlocked,
    selectTopic,
    completeLesson,
    solveProblem,
    unlockAchievement,
    setStudentName,
    completeMission,
    setCurrentMission,
    recordStepError,
    recordErrorSelfFix,
    getTrainingFocus,
    getLumenRecommendation,
    completeTraining,
    startProblemSession,
    trackProblemStep,
    trackProblemError,
    trackProblemHint,
    finishProblemSession,
    getDailyProblem,
    ensureDailyProblem,
    topicsMastered,
    missionsCompleted,
  };

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}

export function useAchievementsWithProgress() {
  const { isAchievementUnlocked } = useProgress();
  return achievementDefs.map((a) => ({
    ...a,
    unlocked: isAchievementUnlocked(a.id),
  }));
}
