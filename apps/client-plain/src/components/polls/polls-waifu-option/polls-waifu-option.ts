import { inject } from "inversify";
import { VisionColors, WaifuPoll } from "@wp/common";

import { TYPES } from "@/app";
import { ICharactersApi } from "@/app/api";
import { PollValues } from "@/app/services";
import { component, ComponentBase } from "@/app/components";
import { PollWaifuOptionModel } from "@/components/polls";

import "./polls-waifu-option.scss";
const template = `
<div class="poll-waifu-option">
  <div class="poll-waifu-bar">
    <div class="poll-waifu-fill">
      <div class="poll-waifu-info"></div>
    </div>
  </div>
  <img alt="" class="poll-waifu-icon" />
  <div class="poll-waifu-pick">Pick</div>
</div>
`;

@component("poll-waifu-option", template, true)
export class PollsWaifuOption extends ComponentBase {
  private _pollOptionFill: HTMLDivElement;
  private _pollOptionInfo: HTMLDivElement;

  private _pollOptionPick: HTMLDivElement;

  constructor(
    @inject(TYPES.ICharactersApi) private readonly _characters: ICharactersApi,
    @inject(PollValues) private readonly _values: PollValues,
  ) {
    super(PollsWaifuOption);

    this._pollOptionFill = this.getElement(".poll-waifu-fill");
    this._pollOptionInfo = this.getElement(".poll-waifu-info");
    this._pollOptionPick = this.getElement(".poll-waifu-pick");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: PollWaifuOptionModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);
    const char = await this._characters.fetchCharacter(model.charName);

    if (this._values.isAlreadyVoted(model.pollTitle))
      this._pollOptionPick.classList.add("poll-waifu-disabled");
    else this._pollOptionPick.classList.remove("poll-waifu-disabled");

    this._pollOptionPick.addEventListener("click", () => {
      this._values.incOptionValue(model.pollTitle, model.charName);
    });

    this._values.on("update", (poll: WaifuPoll) => {
      if (poll.title === model.pollTitle) {
        const value = this._values.getOptionValue(
          model.pollTitle,
          model.charName,
        );
        this._pollOptionFill.style.width = `${value}%`;
        this._pollOptionInfo.textContent = `${char.name}:${poll.options.get(model.charName)?.length}`;

        if (this._values.isAlreadyVoted(poll.title))
          this._pollOptionPick.classList.add("poll-waifu-disabled");
        else this._pollOptionPick.classList.remove("poll-waifu-disabled");
      }
    });

    let charColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (charColor == null) {
      charColor = VisionColors.default;
    }

    const iconElement = this.getElement<HTMLImageElement>(".poll-waifu-icon");
    try {
      iconElement.src = await this._characters.fetchCharacterIcon(
        model.charName,
        "side",
      );
    } catch {
      iconElement.style.backgroundColor = charColor;
    }
    iconElement.style.borderTop = `solid 1px ${charColor}`;
    iconElement.style.borderLeft = `solid 3px ${charColor}`;
    iconElement.style.borderBottom = `solid 1px ${charColor}`;

    const barFill = this.getElement(".poll-waifu-fill");
    barFill.style.backgroundColor = charColor;
    barFill.style.width = `${this._values.getOptionValue(model.pollTitle, model.charName)}%`;

    this._pollOptionInfo.textContent = `${char.name}:${model.votes.toString()}`;
  }
}
