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

export interface LessonExplanation {
  shortExplanation: string;
  lifeExample: string;
  miniExample: string;
  commonMistakes: string;
  howToRemember: string;
  selfCheck: string[];
}

export interface WhyNeededDetails {
  lifeUse: string[];
  futureConnections: string[];
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  content: string[];
  explanation: LessonExplanation;
  whyNeeded: string[];
  whyNeededDetails: WhyNeededDetails;
  skillTrained: string;
}

export interface ProblemStep {
  id: number;
  title: string;
  hint: string;
  content: string;
  simpleExplanation: string;
  whyNeeded: string;
  question: string;
  lumenHint: string;
  answerOptions?: string[];
  expectedAnswer?: string;
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

export type LumenSituation =
  | 'topic-start'
  | 'not-understood'
  | 'wrong-answer'
  | 'correct-answer'
  | 'hint-request'
  | 'step-complete'
  | 'problem-complete';

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
