import { Request, Response, NextFunction } from "express";

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    res.status(204).send();
  } else return next();
}
