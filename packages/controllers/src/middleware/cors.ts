import { Request, Response, NextFunction } from "express";

import { StaticConfig } from "@wp/common";

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
    res.header(
      "Access-Control-Allow-Methods",
      StaticConfig.serverAllowedMethods.map((m) => m.toUpperCase()).join(", "),
    );
    res.status(204).send();
  } else return next();
}
