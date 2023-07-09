/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "alpha", "development", "test"]).optional().transform((value) => {
    if(!value) {
      console.error("NODE_ENV is not defined");
    }
    return value ?? "development";
  }),
  TZ: z.string().optional().transform((value) => {
    if(!value) {
      console.error("TZ is not defined");
    }
    return value ?? "UTC";
  }),
});

const constant = envSchema.parse(process.env);

export const getConstant = <T extends keyof typeof constant>(key: T): typeof constant[T] => {
  return constant[key];
};

export type Constant = typeof constant
