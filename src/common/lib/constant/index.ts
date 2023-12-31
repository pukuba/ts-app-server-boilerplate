/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "alpha", "development", "test"]).optional().transform((value) => {
    if (!value) {
      console.error("NODE_ENV is not defined");
    }
    return value ?? "development";
  }),
  TZ: z.string().optional().transform((value) => {
    if (!value) {
      console.error("TZ is not defined");
    }
    return value ?? "UTC";
  }),
  MONGO_URI: z.string().startsWith("mongodb://").or(z.string().startsWith("mongodb+srv://")),
  TOKEN_PRIVATE_KEY: z.string().length(32),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform((value) => {
    const port = Number(value);
    if (isNaN(port)) {
      console.error("REDIS_PORT is not a number");
      return 6379;
    }
    return port;
  }),
});

const constant = envSchema.parse(process.env);

export const getConstant = <T extends keyof typeof constant>(key: T): typeof constant[T] => {
  return constant[key];
};

export type Constant = typeof constant;

export const isProd = getConstant("NODE_ENV") === "production";
