import { schema } from "../../src/graphql/schema";
import { GraphQLError, graphql } from "graphql";

export const execute = async <T>(query: string, variables: Record<string, unknown> | null): Promise<[T, null] | [null, readonly GraphQLError[]]> => {
  const { data, errors } =await graphql({
    schema,
    source: query,
    variableValues: variables,
  });

  return errors ?  [null, errors] : [data as T, null];
};

export const gql = (strings: TemplateStringsArray): string => strings.join("");
