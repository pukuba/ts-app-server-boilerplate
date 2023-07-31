import { FastifyInstance } from "fastify";
import mercurius from "mercurius";
import { schema } from "./schema";
import { getPrismaService } from "~/services/prisma";
import { MercuriusContext } from "./types";
import { getRedisService } from "~/services/redis";
import { getUserByContext } from "./resolvers/Directives/Auth/AuthDirective";

export const mercuriusRegister = (app: FastifyInstance): void => {
  app.register(mercurius, {
    schema,
    jit: 100,
    graphiql: true,
    context: async (request, reply): Promise<MercuriusContext> => {
      const [prisma, redis] = await Promise.all([
        getPrismaService(),
        getRedisService(),
      ]);
      return {
        request,
        reply,
        prisma,
        redis,
        viewer: getUserByContext(redis, prisma, request),
      };
    },
  });
};
