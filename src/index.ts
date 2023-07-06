import "@lib/dotenv"

import fastify from "fastify"
import { mercuriusRegister } from "./graphql"

const app = fastify()

app.get("/healthz", (req, reply) => {
  reply.code(200).send("OK")
})

mercuriusRegister(app);

app.listen({ port: 3000 }).then((value) =>  {
  console.log(`Server listening on ${value}`)
})
