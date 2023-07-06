import fastify from "fastify"

const app = fastify()

app.get("/healthz", (req, reply) => {
  reply.code(200).send("OK")
})

app.listen({ port: 3000 }).then((value) =>  {
  console.log(`Server listening on ${value}`)
})
