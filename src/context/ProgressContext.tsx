import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { StoredProgress } from '../types';
import { achievements as achievementDefs } from '../data/achievements';
import { topicIds, topics } from '../data/topics';
import {
  completeLesson as completeLessonUtil,
  completeMission as completeMissionUtil,
  calculateOverallProgress,
  loadProgress,
  saveProgress,
  selectTopic as selectTopicUtil,
  setCurrentMission as setCurrentMissionUtil,
  setStudentName as setStudentNameUtil,
  solveProblem as solveProblemUtil,
  unlockAchievement as unlockAchievementUtil,
} from '../utils/progressStorage';

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
  topicsMastered: number;
  missionsCompleted: number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<StoredProgress>(() => {
    const loaded = loadProgress();
    return {
      ...loaded,
      overallProgress: calculateOverallProgress(loaded.topicProgress, topicIds),
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
      const next = completeLessonUtil(lessonId, topicId, prev, topicIds);
      return unlockAchievementUtil('first-step', next);
    });
  }, []);

  const solveProblem = useCallback((problemId: string, topicId: string) => {
    setProgress((prev) => {
      let next = solveProblemUtil(problemId, topicId, prev, topicIds);
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

  const topicsMastered = useMemo(
    () => topics.filter((t) => getTopicProgress(t.id) >= 70).length,
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
