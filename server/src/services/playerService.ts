import type { Difficulty, PrismaClient } from '@prisma/client';

import { validationError } from '../utils/errors';

export const getPlayerStats = async (prisma: PrismaClient, playerId: string) => {
  const aggregates = await prisma.matchSession.groupBy({
    by: ['difficulty'],
    where: { playerId },
    _min: { elapsedSeconds: true, moves: true },
    _avg: { moves: true },
    _count: { _all: true },
  });

  const stats = {
    totalMatches: 0,
    bestTimeEasy: null as number | null,
    bestTimeMedium: null as number | null,
    bestMovesEasy: null as number | null,
    bestMovesMedium: null as number | null,
    averageMovesEasy: null as number | null,
    averageMovesMedium: null as number | null,
  };

  for (const row of aggregates) {
    stats.totalMatches += row._count._all;
    if (row.difficulty === 'EASY') {
      stats.bestTimeEasy = row._min.elapsedSeconds ?? null;
      stats.bestMovesEasy = row._min.moves ?? null;
      stats.averageMovesEasy = row._avg.moves ?? null;
    }
    if (row.difficulty === 'MEDIUM') {
      stats.bestTimeMedium = row._min.elapsedSeconds ?? null;
      stats.bestMovesMedium = row._min.moves ?? null;
      stats.averageMovesMedium = row._avg.moves ?? null;
    }
  }

  return stats;
};

export const getLeaderboard = async (
  prisma: PrismaClient,
  difficulty: Difficulty,
  limit: number,
) => {
  const grouped = await prisma.matchSession.groupBy({
    by: ['playerId'],
    where: { difficulty },
    _min: { elapsedSeconds: true, moves: true },
  });

  const ordered = grouped
    .sort((a, b) => {
      const timeDiff = (a._min.elapsedSeconds ?? 0) - (b._min.elapsedSeconds ?? 0);
      if (timeDiff !== 0) return timeDiff;
      return (a._min.moves ?? 0) - (b._min.moves ?? 0);
    })
    .slice(0, limit);

  const players = await prisma.player.findMany({
    where: { id: { in: ordered.map((entry) => entry.playerId) } },
  });
  const playerMap = new Map(players.map((player) => [player.id, player]));

  return ordered.map((entry) => {
    const player = playerMap.get(entry.playerId);
    if (!player) {
      throw validationError('Leaderboard player not found');
    }
    return {
      player,
      bestTime: entry._min.elapsedSeconds ?? 0,
      bestMoves: entry._min.moves ?? 0,
    };
  });
};

export const getRecentMatches = async (
  prisma: PrismaClient,
  playerId: string,
  limit: number,
) =>
  prisma.matchSession.findMany({
    where: { playerId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
