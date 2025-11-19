import { inject } from "tsyringe";

import { component, ComponentBase, Router } from "@/components";
import { ICharsApi } from "@/services";

import "./app-header.scss";
const template = `
<div class="header">
  <a href="/" class="title">My Waifu Picker</a>
  <div class="waifu-list-wrapper">
    <div class="waifu-list-desc">
      Here is the list of all currently available waifus!
    </div>
    <div class="waifu-list"></div>
  </div>
</div>
`;

@component("app-header", template)
export class AppHeader extends ComponentBase {
  constructor(
    @inject("ICharsApi") private readonly _api: ICharsApi,
    private readonly _router: Router,
  ) {
    super(AppHeader);
  }

  public override async initialize(): Promise<void> {
    const waifuList = await this._api.fetchCharacterList();
    this.getElement(".waifu-list").textContent = waifuList.join(", ");

    this.getElement(".title").addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", (e.target as HTMLAnchorElement).href);
      this._router.changeLocation((e.target as HTMLAnchorElement).pathname);
    });
  }
}
