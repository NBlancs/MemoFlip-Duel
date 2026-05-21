import type { GraphQLContext } from '../types';
import { getLeaderboard, getPlayerStats, getRecentMatches } from '../services/playerService';
import { requireUser } from '../utils/auth';
import { validationError } from '../utils/errors';

export const playerResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireUser(context.user);
      const player = await context.prisma.player.findUnique({
        where: { id: user.id },
      });
      if (!player) {
        throw validationError('Player not found');
      }
      return player;
    },
    leaderboard: async (
      _: unknown,
      { difficulty, limit }: { difficulty: 'EASY' | 'MEDIUM'; limit?: number },
      context: GraphQLContext,
    ) => {
      const safeLimit = Math.min(Math.max(limit ?? 10, 1), 50);
      const entries = await getLeaderboard(context.prisma, difficulty, safeLimit);
      return entries;
    },
  },
  Player: {
    stats: async (player: { id: string }, _: unknown, context: GraphQLContext) =>
      getPlayerStats(context.prisma, player.id),
    recentMatches: async (
      player: { id: string },
      { limit }: { limit?: number },
      context: GraphQLContext,
    ) => getRecentMatches(context.prisma, player.id, limit ?? 10),
  },
};
