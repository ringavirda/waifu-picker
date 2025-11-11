import { container } from "tsyringe";
import { compare, hash } from "bcryptjs";
import { fetchCurrentIp, WaifuPol } from "@wp/common";

import { component, ComponentBase, loadComponent } from "@/components";
import { PolsPage, PolsWaifuOption } from "@/components/pols";
import { PolsApi, PolsValues } from "@/services";

import "./pols-waifu.scss";
const template = `
<div class="pols-waifu">
  <div class="pols-border">
    <div class="pols-header">
      <div class="pols-title"></div>
      <div class="pols-buttons">
        <div class="pols-retract">Retract</div>
        <div class="pols-close">Close</div>
      </div>
    </div>
    <div class="pols-desc"></div>
    <div class="pols-options"></div>
  </div>
</div>
`;

export type PolsWaifuOptionModel = {
  polTitle: string;
  charName: string;
  votes: number;
  value: number;
  pickCallback: (waifu: string) => Promise<void>;
};

@component("pols-waifu", template, true)
export class PolsWaifu extends ComponentBase {
  private _polTitleElement: HTMLDivElement;
  private _polDescElement: HTMLDivElement;
  private _polOptionsElement: HTMLDivElement;

  private _polRetractElement: HTMLDivElement;

  private _polModel: WaifuPol = null!;

  constructor(
    private readonly _api: PolsApi,
    private readonly _values: PolsValues,
  ) {
    super(PolsWaifu);

    this._polTitleElement = this.getElement(".pols-title");
    this._polDescElement = this.getElement(".pols-desc");
    this._polOptionsElement = this.getElement(".pols-options");

    this._polRetractElement = this.getElement(".pols-retract");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: WaifuPol,
  ): Promise<void> {
    this._polModel = this.modelIsDefined(model);

    if (this._values.isAlreadyVoted(this._polModel.title))
      this._polRetractElement.classList.remove("pols-waifu-disabled");
    else this._polRetractElement.classList.add("pols-waifu-disabled");

    this._polRetractElement.addEventListener(
      "click",
      (async () => {
        const ipHash = await hash(await fetchCurrentIp(), 0);
        for (const [option, votes] of this._polModel.options) {
          if (votes.find((vote) => compare(vote, ipHash))) {
            this._values.decOptionValue(this._polModel.title, option);
          }
        }
      }).bind(this),
    );

    this.getElement(".pols-close").addEventListener(
      "click",
      (async () => {
        await this._api.fetchRemovePol(this._polModel);
        const page = container.resolve(PolsPage);
        await page.reloadPols();
      }).bind(this),
    );

    this._values.on(
      "changed",
      (async (pol: WaifuPol) => {
        if (pol.title === this._polModel.title) {
          await this._api.fetchUpdatePol(pol);
          this._polModel.options = pol.options;

          if (this._values.isAlreadyVoted(pol.title))
            this._polRetractElement.classList.remove("pols-waifu-disabled");
          else this._polRetractElement.classList.add("pols-waifu-disabled");

          this._values.emit("update", pol);
        }
      }).bind(this),
    );

    this._polTitleElement.textContent = this._polModel.title;
    if (this._polModel.description === undefined)
      this._polDescElement.style.display = "none";
    else this._polDescElement.textContent = this._polModel.description;

    for (const [option, options] of this._polModel.options.entries()) {
      await loadComponent(this._polOptionsElement, PolsWaifuOption, {
        polTitle: this._polModel.title,
        charName: option,
        votes: options.length,
        value: options.length * 10,
      } as PolsWaifuOptionModel);
    }
  }
}
