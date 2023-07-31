import { GraphQLResolveInfo } from "graphql";
import { getPathFromResolveInfo } from "./info";
import { AuthenticationErrorCase, ErrorResolvers } from "@graphql/__generated__/typings";

export type ErrorType = NonNullable<Awaited<ReturnType<ErrorResolvers["__resolveType"]>>>;

interface IGraphQLError {
  resolveType: ErrorType;
  __typename: ErrorType;
}

export type GraphQLError = Omit<IGraphQLError & Error, "name">;
export type GraphQLErrorWithSuggestion = GraphQLError & { suggestion: string; };
export type GraphQLAuthenticationError = GraphQLErrorWithSuggestion & { case: AuthenticationErrorCase; };

export const createUnknownError = (message: string, info: GraphQLResolveInfo): GraphQLError => {
  return {
    message,
    stack: getPathFromResolveInfo(info).join(" > "),
    resolveType: "UnknownError",
    __typename: "UnknownError",
  } as const;
};

export const createErrorWithSuggestion = (message: string, suggestion: string): GraphQLErrorWithSuggestion => {
  return {
    message,
    resolveType: "UserDuplicateError",
    __typename: "UserDuplicateError",
    suggestion,
  } as const;
};

export const createAuthenticationError = (errorCase: AuthenticationErrorCase, suggestion: string): GraphQLAuthenticationError => {
  return {
    message: "Authentication error.",
    resolveType: "AuthenticationError",
    case: errorCase,
    suggestion,
    __typename: "AuthenticationError",
  } as const;
};
