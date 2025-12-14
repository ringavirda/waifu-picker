import { inject } from "inversify";

import { Router, TYPES } from "@/app";
import { ICharactersApi } from "@/app/api";
import { component, ComponentBase } from "@/app/components";

import "./header.scss";
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

@component("header", template)
export class Header extends ComponentBase {
  constructor(
    @inject(TYPES.ICharactersApi) private readonly _characters: ICharactersApi,
    private readonly _router: Router,
  ) {
    super(Header);
  }

  public override async initialize(): Promise<void> {
    const waifuList = await this._characters.fetchCharacterList();
    this.getElement(".waifu-list").textContent = waifuList.join(", ");

    this.getElement(".title").addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", (e.target as HTMLAnchorElement).href);
      this._router.changeLocation((e.target as HTMLAnchorElement).pathname);
    });
  }
}
