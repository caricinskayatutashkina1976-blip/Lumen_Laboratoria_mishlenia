export type Difficulty = 'лёгкий' | 'средний' | 'сложный';

export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  progress: number;
  slug: string;
  order: number;
  unlockAfter?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  category: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  content: string[];
  whyNeeded: string[];
  skillTrained: string;
}

export interface ProblemStep {
  id: number;
  title: string;
  hint: string;
  content: string;
  simpleExplanation: string;
  completed: boolean;
}

export interface Problem {
  id: string;
  topicId: string;
  title: string;
  condition: string;
  steps: ProblemStep[];
  answer: string;
  difficulty: Difficulty;
}

export interface StudentProfile {
  name: string;
  level: number;
  levelTitle: string;
  xp: number;
  xpToNext: number;
  missionsCompleted: number;
  topicsMastered: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  topicId?: string;
}

export type LumenAction =
  | 'explain-simpler'
  | 'show-example'
  | 'step-by-step'
  | 'show-scheme'
  | 'easier-problem'
  | 'check-answer'
  | 'still-confused';

export interface LumenResponse {
  action: LumenAction;
  message: string;
}

export interface StoredProgress {
  studentName: string;
  selectedTopics: string[];
  completedLessons: string[];
  solvedProblems: string[];
  unlockedAchievements: string[];
  topicProgress: Record<string, number>;
  overallProgress: number;
  completedMissions: string[];
  currentMissionId: string;
  lastVisit: string;
}
