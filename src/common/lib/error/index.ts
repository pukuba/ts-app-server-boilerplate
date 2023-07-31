import _ from "lodash";
import { logger } from "../logger";

export const logErrorMessage = (errorType: string) => {
  return <T extends Error>(error: T): T => {
    logger.error(`${errorType}: ${error.message}`);
    return error;
  };
};
