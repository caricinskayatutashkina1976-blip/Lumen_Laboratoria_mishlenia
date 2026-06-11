import type { StoredProgress } from '../types';

const STORAGE_KEY = 'lumen-laboratoria-progress';

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
};

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, lastVisit: new Date().toISOString() };

    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      topicProgress: parsed.topicProgress ?? {},
      selectedTopics: parsed.selectedTopics ?? [],
      completedLessons: parsed.completedLessons ?? [],
      solvedProblems: parsed.solvedProblems ?? [],
      unlockedAchievements: parsed.unlockedAchievements ?? ['first-step'],
      completedMissions: parsed.completedMissions ?? [],
    };
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
  topicIds: string[],
): StoredProgress {
  const completedLessons = progress.completedLessons.includes(lessonId)
    ? progress.completedLessons
    : [...progress.completedLessons, lessonId];

  const current = progress.topicProgress[topicId] ?? 0;
  const topicProgress = {
    ...progress.topicProgress,
    [topicId]: Math.min(100, Math.max(current, 25)),
  };

  return {
    ...progress,
    completedLessons,
    topicProgress,
    overallProgress: calculateOverallProgress(topicProgress, topicIds),
  };
}

export function solveProblem(
  problemId: string,
  topicId: string,
  progress: StoredProgress,
  topicIds: string[],
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

  return {
    ...progress,
    solvedProblems,
    topicProgress,
    overallProgress: calculateOverallProgress(topicProgress, topicIds),
  };
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

export { DEFAULT_PROGRESS, STORAGE_KEY };
