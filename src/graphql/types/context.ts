import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "~/services/__generated__/prisma";

export type MercuriusContext = {
  request: FastifyRequest;
  reply: FastifyReply;
  prisma: PrismaClient
}
