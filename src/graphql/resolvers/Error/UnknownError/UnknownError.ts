import { Resolvers } from "../../../__generated__/typings";

export const UnknownError: Resolvers["UnknownError"] = {
  stack: (parent) => {
    return parent.stack ?? null
  },
}
