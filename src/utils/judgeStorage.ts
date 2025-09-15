// Local storage utilities for judge system
export const JUDGE_STORAGE_KEY = 'hackathon-selected-judge';

export interface StoredJudge {
  id: string;
  name: string;
  title: string;
}

export const getSelectedJudge = (): StoredJudge | null => {
  try {
    const stored = localStorage.getItem(JUDGE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading judge from localStorage:', error);
    return null;
  }
};

export const setSelectedJudge = (judge: StoredJudge): void => {
  try {
    localStorage.setItem(JUDGE_STORAGE_KEY, JSON.stringify(judge));
  } catch (error) {
    console.error('Error saving judge to localStorage:', error);
  }
};

export const clearSelectedJudge = (): void => {
  try {
    localStorage.removeItem(JUDGE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing judge from localStorage:', error);
  }
};