import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return new Date(value as string).toISOString();
  },
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new Error('DateTime must be a string');
    }
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new Error('DateTime must be a string');
    }
    return new Date(ast.value);
  },
});
