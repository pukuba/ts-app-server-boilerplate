import _ from "lodash";
import { getConstant, isProd } from "~/common";

import { PrismaClient } from "../__generated__/prisma";

export * from "./constant";

export const getPrismaService = _.memoize(async()=> {
  const prismaClient = new PrismaClient({
    log: isProd ? [] : ["query", "info", "error", "warn"],
    datasources: {
      db: {
        url: getConstant("MONGO_URI"),
      },
    },
  });

  await prismaClient.$connect();

  return prismaClient;
});

export type PrismaService = ReturnType<typeof getPrismaService>;
