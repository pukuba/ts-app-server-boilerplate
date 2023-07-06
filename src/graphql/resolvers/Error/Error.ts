import { Resolvers } from "../../__generated__/typings";

export const Error: Resolvers["Error"] = {
  message: (parent) => {
    return parent.message
  },
  name: (parent) => {
    return parent.name
  },
  __resolveType: (parent) => parent.resolveType,
}