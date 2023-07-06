import { FastifyInstance } from "fastify"
import mercurius from "mercurius"
import { schema } from "./schema"

export const mercuriusRegister = (app: FastifyInstance): void => {
  app.register(mercurius, {
    schema,
    jit: 100,
    graphiql: true,
  })
}
