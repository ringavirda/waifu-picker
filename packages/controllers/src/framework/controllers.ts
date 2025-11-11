import {
  Express,
  NextFunction,
  RequestHandler,
  Request,
  Response,
} from "express";
import { container, singleton } from "tsyringe";

import logger from "./logger";
import { BadRequestError, NotFoundError } from "./errors/requests";

export type RouteAllowedMethods = "get" | "post" | "put" | "delete";
export type RouteHandlersMap = Map<
  RouteAllowedMethods,
  Map<string, Array<RequestHandler>>
>;

export type AllowedContentTypes =
  | "text/html"
  | "application/json"
  | "image/png"
  | "image/jpeg";

export abstract class ControllerBase {
  protected ok(
    res: Response,
    payload?: any,
    contentType: AllowedContentTypes = "application/json",
  ) {
    return this.send(res, 200, payload, contentType);
  }
  protected badRequest(
    res: Response,
    message: string,
    contentType: AllowedContentTypes = "application/json",
  ) {
    return this.send(res, 400, { reason: message }, contentType);
  }
  protected notFound(
    res: Response,
    message: string,
    contentType: AllowedContentTypes = "application/json",
  ) {
    return this.send(res, 404, { reason: message }, contentType);
  }

  protected send(
    res: Response,
    status: number,
    payload: any,
    contentType: AllowedContentTypes,
  ) {
    return res.status(status).type(contentType).send(payload);
  }
}

export function controller<T extends ControllerBase>(
  controllerRoute: string = "/api",
) {
  return function (target: { new (): T }) {
    Reflect.defineMetadata("controllerRoute", controllerRoute, target);

    singleton()(target);
  };
}

export function route<T extends ControllerBase>(
  method: RouteAllowedMethods,
  path: string = "",
  ...middleware: Array<RequestHandler>
) {
  return function (target: T, key: string, desc: PropertyDescriptor) {
    const routeHandlers: RouteHandlersMap =
      Reflect.getMetadata("routeHandlers", target) ?? new Map();
    if (!routeHandlers.has(method)) routeHandlers.set(method, new Map());

    routeHandlers
      .get(method)
      ?.set(path, [...middleware, desc.value as RequestHandler]);

    Reflect.defineMetadata("routeHandlers", routeHandlers, target);
  };
}

export function useControllerRoutes<T extends ControllerBase>(
  ctor: { new (): T },
  server: Express,
) {
  const controller = new ctor();
  const context = container.resolve(ctor);

  const routeHandlers: RouteHandlersMap = Reflect.getMetadata(
    "routeHandlers",
    controller,
  );
  const methods = Array.from(routeHandlers.keys());

  let controllerPath = Reflect.getMetadata(
    "controllerRoute",
    controller.constructor,
  );
  controllerPath = controllerPath === "/" ? "" : controllerPath;

  methods.forEach((method) => {
    const routes = routeHandlers.get(method);

    if (routes !== undefined) {
      const routePaths = Array.from(routes.keys());

      routePaths.forEach((path) => {
        const routePath = path === "/" ? "" : path;
        const handlers = routes.get(path);

        if (handlers !== undefined) {
          handlers.forEach((handler) => {
            const endpoint = async (
              req: Request,
              res: Response,
              next: NextFunction,
            ) => {
              try {
                return await handler.call(context, req, res, next);
              } catch (err: unknown) {
                const message = (err as Error).message;
                if (err instanceof BadRequestError) {
                  res.status(400).json({ reason: message });
                } else if (err instanceof NotFoundError) {
                  res.status(404).json({ reason: message });
                } else {
                  next(err);
                }
              }
            };

            server[method](controllerPath + routePath, endpoint);
          });
          logger.info(
            "Server",
            `Registered new server route: [${method}] ${controllerPath + routePath}`,
          );
        }
      });
    }
  });
}
