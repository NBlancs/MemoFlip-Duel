import type { GraphQLContext } from '../types';
import { loginPlayer, registerPlayer } from '../services/authService';
import { parseLoginInput, parseRegisterInput } from '../validators/authValidator';

export const authResolvers = {
  Mutation: {
    register: async (_: unknown, { input }: { input: unknown }, context: GraphQLContext) => {
      const data = parseRegisterInput(input);
      const player = await registerPlayer(context.prisma, data);
      const token = context.reply.server.jwt.sign({
        sub: player.id,
        email: player.email,
      });
      return { token, player };
    },
    login: async (_: unknown, { input }: { input: unknown }, context: GraphQLContext) => {
      const data = parseLoginInput(input);
      const player = await loginPlayer(context.prisma, data);
      const token = context.reply.server.jwt.sign({
        sub: player.id,
        email: player.email,
      });
      return { token, player };
    },
  },
};
