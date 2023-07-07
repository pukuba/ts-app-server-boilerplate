import { DateTimeResolver } from "graphql-scalars";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./__generated__";
import { resolvers } from "./resolvers";

export const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers:{
    ...resolvers,

    DateTime: DateTimeResolver,
  },
});
