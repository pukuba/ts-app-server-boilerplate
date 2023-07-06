import { Resolvers } from "@graphql/__generated__";

export const UnknownError: Resolvers["UnknownError"] = {
  stack: (parent) => {
    return parent.stack ?? null
  },
}
