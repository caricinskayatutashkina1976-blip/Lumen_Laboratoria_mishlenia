import type { HomeworkType } from '../data/homeworkAnalyzer';

const STORAGE_KEY = 'homeworkDraft';

export interface HomeworkDraft {
  condition: string;
  type: HomeworkType;
  activeStep: number;
  stepAnswers: Record<number, string>;
  currentInput?: string;
  completed: boolean;
  savedAt: string;
}

export function loadHomeworkDraft(): HomeworkDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HomeworkDraft;
    if (!parsed.condition?.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveHomeworkDraft(draft: HomeworkDraft): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore quota errors
  }
}

export function clearHomeworkDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
