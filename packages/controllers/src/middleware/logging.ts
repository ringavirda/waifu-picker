import { Request, Response, NextFunction } from "express";

import { logger } from "../framework";

const allowedStatusCodes = [200, 204, 301, 304];

export const loggingMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.on("finish", () => {
    if (allowedStatusCodes.includes(response.statusCode)) {
      logger.info(
        "Request",
        `[${request.method}] to ${request.url} from ${request.socket.remoteAddress} returned status (${response.statusCode}).`,
      );
    } else {
      logger.warn(
        "Request",
        `[${request.method}] to ${request.url} from ${request.socket.remoteAddress} returned with bad status (${response.statusCode}).`,
      );
    }
  });
  return next();
};
