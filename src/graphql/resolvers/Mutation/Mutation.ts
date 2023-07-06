import { Resolvers } from "../../__generated__/typings";
import { createUnknownError } from "../../utils/error";

export const Mutation: Resolvers["Mutation"] ={
  throw: (parent, args, context, info) => {
    return createUnknownError("UnknownError", "UnknownError", info)
  },
}
