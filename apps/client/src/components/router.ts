import { singleton } from "tsyringe";

import { ComponentBase, loadComponent } from "./components";
import { PopoverWrapper } from "./popover-wrapper/popover";

export type Route = {
  path: string;
  component: { new (...args: any[]): ComponentBase };
};

export type RouterEventCallback = (path: string, model?: any) => void;
export type RouterEvents = "route";

@singleton()
export class Router {
  private _anchors: Map<HTMLElement, Array<Route>> = new Map();
  private _eventHandlers: Map<string, Array<RouterEventCallback>> = new Map();

  private _restrictedVisibility: Map<HTMLElement, Array<string>> = new Map();

  private _popover: ComponentBase | null = null;
  private _popoverEscListener = async (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      await this.removePopover();
    }
  };

  constructor() {
    window.onhashchange = () => this.changeLocation();
    this._eventHandlers.set("route", []);
    this._popoverEscListener = this._popoverEscListener.bind(this);
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

  public async displayPopover(innerComponent: {
    new (...args: any[]): ComponentBase;
  }) {
    if (this._popover !== null)
      throw new Error("There can be only one popover at a time!");
    else {
      this._popover = await loadComponent(
        document.body,
        PopoverWrapper,
        innerComponent,
      );
      document.addEventListener("keyup", this._popoverEscListener);
    }
  }

  public async removePopover() {
    if (this._popover === null)
      throw new Error("Cannot unload popover that doesn't exist");
    else {
      const popElement = document.querySelector<HTMLElement>(
        this._popover.selector,
      )!;
      popElement.style.animation = "fade-out 0.5s";
      await new Promise((r) => setTimeout(r, 400));

      document.body.removeChild(popElement);
      document.removeEventListener("keyup", this._popoverEscListener);
      this._popover = null;
    }
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
