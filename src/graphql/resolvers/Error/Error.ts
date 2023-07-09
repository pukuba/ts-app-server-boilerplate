import { Resolvers } from "@graphql/__generated__";

export const Error: Resolvers["Error"] = {
  message: (parent) => {
    return parent.message;
  },
  __resolveType: (parent) => parent.resolveType,
};
