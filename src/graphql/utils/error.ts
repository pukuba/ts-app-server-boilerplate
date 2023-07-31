import { GraphQLResolveInfo } from "graphql";
import { match } from "ts-pattern";
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

const matchAuthenticationErrorSuggestions = (error: AuthenticationErrorCase): string => {
  return match(error)
    .with(AuthenticationErrorCase.Expired, () => "Your token has expired. Please log in again.")
    .with(AuthenticationErrorCase.InvalidToken, () => "The provided token is invalid. Please log in again.")
    .with(AuthenticationErrorCase.BlacklistedToken, () => "Your token has been ended. Please log in again.")
    .with(AuthenticationErrorCase.NonExistentUser, () => "The user associated with this token does not exist. Please log in with a valid account.")
    .with(AuthenticationErrorCase.MissingAuthToken, () => "No authentication token found. Please log in.")
    .with(AuthenticationErrorCase.Unknown, () => "An unknown authentication error occurred. Please try logging in again.")
    .otherwise(() => "An unexpected error occurred. Please try logging in again.");
};

export const createAuthenticationError = (errorCase: AuthenticationErrorCase, suggestion?: string): GraphQLAuthenticationError => {
  return {
    message: "Authentication error.",
    resolveType: "AuthenticationError",
    case: errorCase,
    suggestion: suggestion ?? matchAuthenticationErrorSuggestions(errorCase),
    __typename: "AuthenticationError",
  } as const;
};
