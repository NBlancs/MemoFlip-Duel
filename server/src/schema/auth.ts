export const authSchema = `
  type AuthPayload {
    token: String!
    player: Player!
  }

  input RegisterInput {
    email: String!
    password: String!
    displayName: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;
