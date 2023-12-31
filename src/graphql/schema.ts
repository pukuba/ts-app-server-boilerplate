import { DateTimeResolver, EmailAddressResolver, ObjectIDResolver } from "graphql-scalars";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./__generated__";
import { resolvers } from "./resolvers";
import { attachDirectiveResolvers, directivesResolvers } from "./resolvers/Directives";

export const schema = attachDirectiveResolvers(makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: {
    ...resolvers,

    DateTime: DateTimeResolver,
    Email: EmailAddressResolver,
    ObjectID: ObjectIDResolver,
  },
  inheritResolversFromInterfaces: true,
}), directivesResolvers);
