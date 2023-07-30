import _ from "lodash";
import { logger } from "../logger";

export const logErrorMessage = _.curry((errorType: string, error: Error): void => {
  logger.error(`${errorType}: ${error.message}`);
});
