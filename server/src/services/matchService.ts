import type { PrismaClient } from '@prisma/client';

import { validateMatchInput } from '../validators/matchValidator';

export const submitMatch = async (
  prisma: PrismaClient,
  playerId: string,
  input: unknown,
) => {
  const { config, ...data } = validateMatchInput(input);

  return prisma.matchSession.create({
    data: {
      playerId,
      difficulty: data.difficulty,
      moves: data.moves,
      elapsedSeconds: data.elapsedSeconds,
      gridRows: data.gridRows ?? config.rows,
      gridCols: data.gridCols ?? config.cols,
    },
  });
};
