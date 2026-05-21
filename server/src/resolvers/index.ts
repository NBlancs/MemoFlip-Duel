import { DateTimeScalar } from '../utils/scalars';
import { authResolvers } from './auth';
import { matchResolvers } from './match';
import { playerResolvers } from './player';

export const resolvers = {
  DateTime: DateTimeScalar,
  Query: {
    ...playerResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...matchResolvers.Mutation,
  },
  Player: playerResolvers.Player,
};
