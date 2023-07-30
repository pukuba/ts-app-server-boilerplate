import { FastifyRequest, FastifyReply } from "fastify";
import { RedisService, PrismaService } from "~/services";

export type MercuriusContext = {
  request: FastifyRequest;
  reply: FastifyReply;
  prisma: PrismaService;
  redis: RedisService;
};
