import { Resolvers } from "@graphql/__generated__"

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
