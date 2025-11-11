import { WaifuPol } from "@wp/common";

import { component, ComponentBase, loadComponent } from "@/components";
import { PolsWaifu } from "@/components/pols";
import { PolsApi, PolsValues } from "@/services";

import "./pols.scss";
const template = `<div class='pols-wrapper'></div>`;

@component("pols-page", template)
export class PolsPage extends ComponentBase {
  private _polsWrapperElement: HTMLDivElement;

  constructor(
    private readonly _api: PolsApi,
    private readonly _values: PolsValues,
  ) {
    super(PolsPage);

    this._polsWrapperElement = this.getElement(".pols-wrapper");
  }

  public accessor Pols: Array<WaifuPol> = null!;

  public override async initialize(): Promise<void> {
    await this.reloadPols();

    if (this._element.childNodes.length === 0)
      this._element.appendChild(this._polsWrapperElement);
  }

  public async reloadPols(): Promise<void> {
    this.Pols = await this._api.fetchAllPols();
    await this._values.registerPols(this.Pols);
    this._polsWrapperElement.innerHTML = "";

    if (this.Pols.length === 0) {
      this._polsWrapperElement.classList.add("no-pols");
      this._polsWrapperElement.textContent = "There aren't any pols yet!";
    } else {
      for (const pol of this.Pols) {
        await loadComponent(this._polsWrapperElement, PolsWaifu, pol);
      }

      // this.Pols.forEach((pol) => this._values.emit("update", pol));
    }
  }
}
