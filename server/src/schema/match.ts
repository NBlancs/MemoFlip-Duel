export const matchSchema = `
  type MatchSession {
    id: ID!
    difficulty: Difficulty!
    moves: Int!
    elapsedSeconds: Int!
    gridRows: Int!
    gridCols: Int!
    createdAt: DateTime!
  }

  input SubmitMatchInput {
    difficulty: Difficulty!
    moves: Int!
    elapsedSeconds: Int!
    gridRows: Int
    gridCols: Int
  }

  extend type Mutation {
    submitMatch(input: SubmitMatchInput!): MatchSession!
  }
`;
