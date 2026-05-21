import type { GraphQLContext } from '../types';
import { submitMatch } from '../services/matchService';
import { requireUser } from '../utils/auth';

export const matchResolvers = {
  Mutation: {
    submitMatch: async (_: unknown, { input }: { input: unknown }, context: GraphQLContext) => {
      const user = requireUser(context.user);
      return submitMatch(context.prisma, user.id, input);
    },
  },
};
