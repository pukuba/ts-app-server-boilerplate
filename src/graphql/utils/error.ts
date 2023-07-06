import { GraphQLResolveInfo } from "graphql";
import { stackFromResolveInfo } from "./info";
import { ErrorResolvers } from "@graphql/__generated__/typings";


export type ErrorType = NonNullable<Awaited<ReturnType<ErrorResolvers["__resolveType"]>>>

interface IGraphQLError {
  resolveType: ErrorType
}

export type GraphQLError = Error & IGraphQLError

export const createUnknownError = (name: string, message: string, info: GraphQLResolveInfo): GraphQLError => {
  return {
    name,
    message,
    stack: stackFromResolveInfo(info).join(" > "),
    resolveType: "UnknownError",
  } as const
}
