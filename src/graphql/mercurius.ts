import { makeExecutableSchema } from "@graphql-tools/schema"
import { typeDefs } from "./__generated__"
import { resolvers } from "./resolvers"
import { FastifyInstance } from "fastify"
import mercurius from "mercurius"

export const mercuriusRegister = (app: FastifyInstance) => {
  app.register(mercurius, {
    schema: makeExecutableSchema({typeDefs, resolvers, inheritResolversFromInterfaces: true}),
    jit: 100,
    graphiql: true
  })
}
