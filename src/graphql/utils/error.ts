import { GraphQLResolveInfo } from "graphql";
import { getPathFromResolveInfo } from "./info";
import { ErrorResolvers } from "@graphql/__generated__/typings";

export type ErrorType = NonNullable<Awaited<ReturnType<ErrorResolvers["__resolveType"]>>>;

interface IGraphQLError {
  resolveType: ErrorType
}

export type GraphQLError = Omit<IGraphQLError & Error, "name">;
export type GraphQLErrorWithSuggestion = GraphQLError & { suggestion: string };

export const createUnknownError = (message: string, info: GraphQLResolveInfo): GraphQLError => {
  return {
    message,
    stack: getPathFromResolveInfo(info).join(" > "),
    resolveType: "UnknownError",
  } as const;
};

export const createErrorWithSuggestion = (message: string, suggestion: string): GraphQLErrorWithSuggestion => {
  return {
    message,
    resolveType: "UserDuplicateError",
    suggestion,
  } as const;
};
