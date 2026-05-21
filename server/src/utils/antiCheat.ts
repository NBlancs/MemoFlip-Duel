import type { Difficulty } from '@prisma/client';

export interface DifficultyConfig {
  rows: number;
  cols: number;
  pairs: number;
  minSeconds: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  EASY: { rows: 4, cols: 4, pairs: 8, minSeconds: 12 },
  MEDIUM: { rows: 6, cols: 6, pairs: 18, minSeconds: 28 },
};

export const getDifficultyConfig = (difficulty: Difficulty) => DIFFICULTY_CONFIG[difficulty];

export const getMinimumMoves = (difficulty: Difficulty) =>
  DIFFICULTY_CONFIG[difficulty].pairs;
