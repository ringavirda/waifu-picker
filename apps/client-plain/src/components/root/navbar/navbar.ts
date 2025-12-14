import { container, Router, TYPES } from "@/app";

import { component, ComponentBase } from "@/app/components";
import { PollsCreate } from "@/components/polls";

import "./navbar.scss";
import template from "./navbar.html";
import { CharactersGenshinApi, CharactersServerApi } from "@/app/api";

const charsLoaderKey = "chars-loader";

@component("navbar", template)
export class Navbar extends ComponentBase {
  private _toCharactersElement: HTMLAnchorElement;
  private _toPollsElement: HTMLAnchorElement;

  private _serverLoadSelectElement: HTMLDivElement;
  private _genshinLoadSelectElement: HTMLDivElement;
  private _pollCreateElement: HTMLDivElement;

  constructor(private readonly _router: Router) {
    super(Navbar);

    this._toCharactersElement = this.getElement("[id='chars']");
    this._toPollsElement = this.getElement("[id='polls']");
    this._serverLoadSelectElement = this.getElement("[id='server-load']");
    this._genshinLoadSelectElement = this.getElement("[id='genshin-load']");
    this._pollCreateElement = this.getElement("[id='poll-create']");

    _router.restrictVisibility(this.getElement(".navbar-load-select"), [
      "/chars",
      "/chars/",
    ]);
    _router.restrictVisibility(this.getElement(".navbar-poll-create"), [
      "/polls",
      "/polls/",
    ]);
  }

  public override async initialize(): Promise<void> {
    this._toCharactersElement.addEventListener("click", (e) =>
      this.onNavigationRoute(e, this._router),
    );
    this._toPollsElement.addEventListener("click", (e) =>
      this.onNavigationRoute(e, this._router),
    );

    this._router.on("route", (path) => {
      if (path === "/chars" || path === "/chars/") {
        this._toCharactersElement.classList.add("selected");
        this._toPollsElement.classList.remove("selected");
      } else if (path === "/polls" || path === "/polls/") {
        this._toPollsElement.classList.add("selected");
        this._toCharactersElement.classList.remove("selected");
      } else {
        this._toPollsElement.classList.remove("selected");
        this._toCharactersElement.classList.remove("selected");
      }
    });

    this._serverLoadSelectElement.addEventListener("click", (e) =>
      this.onChangeLoader(e),
    );
    this._genshinLoadSelectElement.addEventListener("click", (e) =>
      this.onChangeLoader(e),
    );

    let saved = window.sessionStorage.getItem(charsLoaderKey);
    if (saved == null) saved = "server-load";
    if (saved === "genshin-load")
      this._genshinLoadSelectElement.dispatchEvent(new Event("click"));
    else this._serverLoadSelectElement.dispatchEvent(new Event("click"));

    this._pollCreateElement.addEventListener("click", () =>
      this._router.displayPopover(PollsCreate),
    );
  }

  private onNavigationRoute(e: MouseEvent, router?: Router): void {
    e.preventDefault();
    window.history.pushState({}, "", (e.target as HTMLAnchorElement).href);
    const path = (e.target as HTMLAnchorElement).pathname;
    router?.changeLocation(path);
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  }

  private onChangeLoader(e: MouseEvent): void {
    const id = (e.target as HTMLDivElement).id;
    if (id === null)
      window.sessionStorage.setItem(charsLoaderKey, "server-load");
    if (id === "server-load") {
      this._serverLoadSelectElement.classList.add("selected-load");
      this._genshinLoadSelectElement.classList.remove("selected-load");
      container.unbind(TYPES.ICharactersApi);
      container
        .bind(TYPES.ICharactersApi)
        .to(CharactersServerApi)
        .inSingletonScope();
    } else if (id === "genshin-load") {
      this._serverLoadSelectElement.classList.remove("selected-load");
      this._genshinLoadSelectElement.classList.add("selected-load");
      container.unbind(TYPES.ICharactersApi);
      container
        .bind(TYPES.ICharactersApi)
        .to(CharactersGenshinApi)
        .inSingletonScope();
    }
    window.sessionStorage.setItem(charsLoaderKey, id);
  }
}
