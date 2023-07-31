import { FastifyRequest, FastifyReply } from "fastify";
import { RedisService, PrismaService } from "~/services";
import { getUserByContext } from "../resolvers/Directives/Auth/AuthDirective";

export type MercuriusContext = {
  request: FastifyRequest;
  reply: FastifyReply;
  prisma: PrismaService;
  redis: RedisService;
  viewer: ReturnType<typeof getUserByContext>;
};
