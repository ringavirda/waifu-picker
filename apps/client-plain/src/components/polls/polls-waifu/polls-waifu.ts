import { inject } from "inversify";
import { compare, hash } from "bcryptjs";
import { fetchCurrentIp, WaifuPoll } from "@wp/common";

import { container } from "@/app";
import { PollsApi } from "@/app/api";
import { PollValues } from "@/app/services";
import { component, ComponentBase, loadComponent } from "@/app/components";
import { PollsPage, PollsWaifuOption } from "@/components/polls";

import "./polls-waifu.scss";
const template = `
<div class="polls-waifu">
  <div class="polls-border">
    <div class="polls-header">
      <div class="polls-title"></div>
      <div class="polls-buttons">
        <div class="polls-retract">Retract</div>
        <div class="polls-close">Close</div>
      </div>
    </div>
    <div class="polls-desc"></div>
    <div class="polls-options"></div>
  </div>
</div>
`;

export type PollWaifuOptionModel = {
  pollTitle: string;
  charName: string;
  votes: number;
  value: number;
  pickCallback: (waifu: string) => Promise<void>;
};

@component("polls-waifu", template, true)
export class PollsWaifu extends ComponentBase {
  private _polTitleElement: HTMLDivElement;
  private _polDescElement: HTMLDivElement;
  private _polOptionsElement: HTMLDivElement;

  private _polRetractElement: HTMLDivElement;

  private _polModel: WaifuPoll = null!;

  constructor(
    @inject(PollsApi) private readonly _polls: PollsApi,
    @inject(PollValues) private readonly _values: PollValues,
  ) {
    super(PollsWaifu);

    this._polTitleElement = this.getElement(".polls-title");
    this._polDescElement = this.getElement(".polls-desc");
    this._polOptionsElement = this.getElement(".polls-options");

    this._polRetractElement = this.getElement(".polls-retract");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: WaifuPoll,
  ): Promise<void> {
    this._polModel = this.modelIsDefined(model);

    if (this._values.isAlreadyVoted(this._polModel.title))
      this._polRetractElement.classList.remove("polls-waifu-disabled");
    else this._polRetractElement.classList.add("polls-waifu-disabled");

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

    this.getElement(".polls-close").addEventListener(
      "click",
      (async () => {
        await this._polls.fetchRemovePoll(this._polModel);
        const page = container.get(PollsPage);
        await page.reloadPolls();
      }).bind(this),
    );

    this._values.on(
      "changed",
      (async (pol: WaifuPoll) => {
        if (pol.title === this._polModel.title) {
          await this._polls.fetchUpdatePoll(pol);
          this._polModel.options = pol.options;

          if (this._values.isAlreadyVoted(pol.title))
            this._polRetractElement.classList.remove("polls-waifu-disabled");
          else this._polRetractElement.classList.add("polls-waifu-disabled");

          this._values.emit("update", pol);
        }
      }).bind(this),
    );

    this._polTitleElement.textContent = this._polModel.title;
    if (this._polModel.description === undefined)
      this._polDescElement.style.display = "none";
    else this._polDescElement.textContent = this._polModel.description;

    for (const [option, options] of this._polModel.options.entries()) {
      await loadComponent(this._polOptionsElement, PollsWaifuOption, {
        pollTitle: this._polModel.title,
        charName: option,
        votes: options.length,
        value: options.length * 10,
      } as PollWaifuOptionModel);
    }
  }
}
