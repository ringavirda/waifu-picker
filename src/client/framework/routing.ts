import { singleton } from "tsyringe";

import { ComponentBase, loadComponent } from "./components";
import { constructor } from "tsyringe/dist/typings/types";

export type Route = {
  path: string;
  component: constructor<ComponentBase>;
};

export type RouterEventCallback = (path: string, model?: any) => void;
export type RouterEvents = "route";

@singleton()
export class Router {
  private _anchors: Map<HTMLElement, Array<Route>> = new Map();
  private _eventHandlers: Map<string, Array<RouterEventCallback>> = new Map();
  private _restrictedVisibility: Map<HTMLElement, Array<string>> = new Map();

  constructor() {
    window.onhashchange = () => this.changeLocation();
    this._eventHandlers.set("route", []);
  }

  public registerAnchor(
    anchor: HTMLElement | null,
    routes: Array<Route>,
  ): void {
    if (anchor == null) throw new Error(`Router: Tried manage null element.`);
    if (this._anchors.has(anchor))
      throw new Error(`Router: Attempted reassign of anchor [${anchor}].`);
    this._anchors.set(anchor, routes);
  }

  public async changeLocation(target?: string): Promise<void> {
    let path = target ?? window.location.pathname;
    if (path[path.length - 1] === "/" && path !== "/")
      path = path.substring(0, path.length - 1);
    const anchorRoute = Array.from(this._anchors).find(
      (a) => a[1].find((r) => r.path == path) !== undefined,
    );

    if (anchorRoute !== undefined) {
      const anchor = anchorRoute[0];
      anchor.innerHTML = "";
      const route = anchorRoute[1].find((r) => r.path == path);
      if (route !== undefined) {
        this.emit("route", path);
        await loadComponent(anchor, route.component);
      }
    } else {
      throw new Error(`Unknown route: [${target}]`);
    }
  }

  public restrictVisibility(element: HTMLElement, routes: Array<string>) {
    this._restrictedVisibility.set(element, routes);
  }

  public on(name: RouterEvents, callback: RouterEventCallback): void {
    this._eventHandlers.get(name)?.push(callback);
  }

  private emit(name: RouterEvents, path: string, model?: any): void {
    if (name === "route") {
      this._eventHandlers
        .get("route")
        ?.forEach((handler) => handler(path, model));

      for (const [element, routes] of this._restrictedVisibility) {
        if (routes.includes(path)) {
          element.style.display = "flex";
        } else element.style.display = "none";
      }
    }
  }
}