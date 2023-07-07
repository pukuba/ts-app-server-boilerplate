import { getConstant } from "../constant";
import  { pino } from "pino";
import { PinoLoggerOptions } from "fastify/types/logger";
import { Stage } from "~/common/types";

const debugStageLogger = (name: Exclude<Stage, "production">): PinoLoggerOptions => ({
  name,
  messageKey: "message",
  errorKey: "error",
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss Z",
      ignore: name === "alpha" ? "" : "pid,hostname",
    },
  },
  crlf: false,
} as const);

const envToLogger: Record<Stage,  PinoLoggerOptions> = {
  development: debugStageLogger("development"),
  alpha: debugStageLogger("alpha"),
  production: { level: "info", crlf: true, name: "pino" },
};

const stage = getConstant("NODE_ENV");

export const loggerOptions = envToLogger[stage];
export const logger = pino(loggerOptions);
