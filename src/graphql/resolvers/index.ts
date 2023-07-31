import { Resolvers } from "@graphql/__generated__";

import { Query } from "./Query";

import { Mutation } from "./Mutation";
import { UserMutation, User } from "./User";
import { Node, NodeQueries } from "./Node";
import { AuthMutation } from "./Auth";

import { Error, UnknownError } from "./Error";

export const resolvers: Resolvers = {
  Query: {
    ...Query,
    ...NodeQueries,
  },
  Mutation: {
    ...Mutation,
    ...UserMutation,
    ...AuthMutation,
  },
  Error,
  UnknownError,
  Node,
  User,
};
