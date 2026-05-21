import { z } from 'zod';

import { getDifficultyConfig, getMinimumMoves } from '../utils/antiCheat';
import { validationError } from '../utils/errors';

const submitMatchSchema = z.object({
  difficulty: z.enum(['EASY', 'MEDIUM']),
  moves: z.number().int().positive(),
  elapsedSeconds: z.number().int().positive(),
  gridRows: z.number().int().positive().optional(),
  gridCols: z.number().int().positive().optional(),
});

export type SubmitMatchInput = z.infer<typeof submitMatchSchema>;

export const validateMatchInput = (input: unknown) => {
  const result = submitMatchSchema.safeParse(input);
  if (!result.success) {
    throw validationError('Invalid match submission', result.error.flatten());
  }

  const { gridRows, gridCols, difficulty, moves, elapsedSeconds } = result.data;
  if ((gridRows && !gridCols) || (!gridRows && gridCols)) {
    throw validationError('Grid rows and columns must both be provided');
  }

  const config = getDifficultyConfig(difficulty);
  if (gridRows && gridRows !== config.rows) {
    throw validationError('Invalid grid rows for difficulty');
  }
  if (gridCols && gridCols !== config.cols) {
    throw validationError('Invalid grid columns for difficulty');
  }

  const minimumMoves = getMinimumMoves(difficulty);
  if (moves < minimumMoves) {
    throw validationError('Moves below minimum possible for this grid');
  }
  if (elapsedSeconds < config.minSeconds) {
    throw validationError('Completion time is unrealistically low for this grid');
  }

  return {
    ...result.data,
    config,
  };
};
