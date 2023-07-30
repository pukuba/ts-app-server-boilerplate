import { FastifyInstance } from "fastify";
import mercurius from "mercurius";
import { schema } from "./schema";
import { getPrismaService } from "~/services/prisma";
import { MercuriusContext } from "./types";
import { getRedisService } from "~/services/redis";

export const mercuriusRegister = (app: FastifyInstance): void => {
  app.register(mercurius, {
    schema,
    jit: 100,
    graphiql: true,
    context: async (request, reply): Promise<MercuriusContext> => {
      return {
        request,
        reply,
        prisma: await getPrismaService(),
        redis: await getRedisService(),
      };
    },
  });
};
