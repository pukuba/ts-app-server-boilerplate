import { Resolvers } from "@graphql/__generated__";

import { Query } from "./Query";

import { Mutation } from "./Mutation";
import { UserMutation } from "./User";

import { Error, UnknownError } from "./Error";

export const resolvers: Resolvers = {
  Query: {
    ...Query,
  },
  Mutation: {
    ...Mutation,
    ...UserMutation,
  },
  Error,
  UnknownError,
};
