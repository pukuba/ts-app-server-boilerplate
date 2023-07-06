import { Resolvers } from "../__generated__/typings"

import { Query } from "./Query"

import { Mutation } from "./Mutation"

import { Error } from "./Error"

export const resolvers: Resolvers = {
  Query: {
    ...Query,
  },
  Mutation: {
    ...Mutation,
  },
  Error,
}
