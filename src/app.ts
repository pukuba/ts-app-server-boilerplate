import "@lib/dotenv";

import fastify from "fastify";
import hyperid from "hyperid";
import { mercuriusRegister } from "./graphql";
import { loggerOptions } from "./common/lib/logger";

const app = fastify({
  logger: loggerOptions,
  genReqId: () => hyperid().uuid,
});

app.get("/healthz", (req, reply) => {
  reply.code(200).send("OK");
});

mercuriusRegister(app);

export { app };
