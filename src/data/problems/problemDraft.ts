import type { ProblemDifficultyLevel, StepAnswerOption, TrainingSkill } from '../../types';

export interface ProblemDraft {
  id: string;
  topicId: string;
  title: string;
  level: ProblemDifficultyLevel;
  problemText: string;
  lifeContext: string;
  correctAnswer: string;
  commonMistake: string;
  visualType: string;
  relatedSkill: TrainingSkill;
  simpleExplanation: string;
  about?: string;
  known?: string;
  find?: string;
  findWrong?: [string, string];
  findAcceptedAnswers?: string[];
  findKeywords?: string[];
  connection?: string;
  action?: string;
  actionWrong?: [string, string];
  actionOptions?: StepAnswerOption[];
  solution?: string;
  solutionAcceptedAnswers?: string[];
  solutionKeywords?: string[];
  check?: string;
  hints?: string[];
  useTextFindStep?: boolean;
}
