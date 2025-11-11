import { Request, Response, NextFunction } from "express";

import { logger } from "../framework";

export function notFoundMiddleware(
  req: Request,
  res: Response,
  // next: NextFunction,
) {
  res.status(404).json({
    error: `The bottom of the middleware stack was reached. Returning with (404) code.`,
  });
}

export function errorHandlingMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err !== undefined) {
    const errMessage = `A server error occurred! Reason: ${err.message}`;
    logger.error("Request", errMessage);
    res.status(500).json({ error: errMessage });
  } else {
    return next();
  }
}
