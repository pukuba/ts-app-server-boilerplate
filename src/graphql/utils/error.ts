import { GraphQLResolveInfo } from "graphql";
import { stackFromResolveInfo } from "./info";
import { ErrorResolvers } from "@graphql/__generated__/typings";


export type NodeResolveType = NonNullable<Awaited<ReturnType<ErrorResolvers["__resolveType"]>>>

interface IGraphQLError {
  resolveType: NodeResolveType
}

export type GraphQLError = Error & IGraphQLError

export const createUnknownError = (name: string, message: string, info: GraphQLResolveInfo): GraphQLError => {
  return {
    message,
    name,
    stack: stackFromResolveInfo(info).join(" > "),
    resolveType: "UnknownError",
  } as const
}
