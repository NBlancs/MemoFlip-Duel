import { authSchema } from './auth';
import { matchSchema } from './match';
import { playerSchema } from './player';

const baseSchema = `
  scalar DateTime

  enum Difficulty {
    EASY
    MEDIUM
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseSchema, authSchema, playerSchema, matchSchema].join('\n');
