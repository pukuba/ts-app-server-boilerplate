import { Resolvers } from "@graphql/__generated__";
import { createUnknownError } from "@graphql/utils/error";

export const Mutation: Resolvers["Mutation"] ={
  throw: (parent, args, context, info) => {
    return createUnknownError("UnknownError", "UnknownError", info)
  },
}
