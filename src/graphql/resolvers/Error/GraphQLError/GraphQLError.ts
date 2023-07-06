import { Resolvers } from "../../../__generated__/typings";

export const GraphQLError: Resolvers["UnknownError"] = {
  stack: (parent) => {
    return parent.stack ?? null
  }
}
