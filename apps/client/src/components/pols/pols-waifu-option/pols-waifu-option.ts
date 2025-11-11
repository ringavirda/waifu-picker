import { VisionColors } from "@wp/common";

import { component, ComponentBase } from "@/components";
import { PolsWaifuOptionModel } from "@/components/pols";
import { CharsApi, PolsValues } from "@/services";

import "./pols-waifu-option.scss";
const template = `
<div class="pol-waifu-option">
  <div class="pol-waifu-bar">
    <div class="pol-waifu-fill">
      <div class="pol-waifu-info"></div>
    </div>
  </div>
  <img alt="" class="pol-waifu-icon" />
  <div class="pol-waifu-pick">Pick</div>
</div>
`;

@component("pol-waifu-option", template, true)
export class PolsWaifuOption extends ComponentBase {
  private _polOptionFill: HTMLDivElement;
  private _polOptionInfo: HTMLDivElement;

  private _polOptionPick: HTMLDivElement;

  constructor(
    private readonly _api: CharsApi,
    private readonly _values: PolsValues,
  ) {
    super(PolsWaifuOption);

    this._polOptionFill = this.getElement(".pol-waifu-fill");
    this._polOptionInfo = this.getElement(".pol-waifu-info");
    this._polOptionPick = this.getElement(".pol-waifu-pick");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: PolsWaifuOptionModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);
    const char = await this._api.fetchCharacter(model.charName);

    if (this._values.isAlreadyVoted(model.polTitle))
      this._polOptionPick.classList.add("pol-waifu-disabled");
    else this._polOptionPick.classList.remove("pol-waifu-disabled");

    this._polOptionPick.addEventListener("click", () => {
      this._values.incOptionValue(model.polTitle, model.charName);
    });

    this._values.on("update", (pol) => {
      if (pol.title === model.polTitle) {
        const value = this._values.getOptionValue(
          model.polTitle,
          model.charName,
        );
        this._polOptionFill.style.width = `${value}%`;
        this._polOptionInfo.textContent = `${char.name}:${pol.options.get(model.charName)?.length}`;

        if (this._values.isAlreadyVoted(pol.title))
          this._polOptionPick.classList.add("pol-waifu-disabled");
        else this._polOptionPick.classList.remove("pol-waifu-disabled");
      }
    });

    let charColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (charColor == null) {
      charColor = VisionColors.default;
    }

    const iconElement = this.getElement<HTMLImageElement>(".pol-waifu-icon");
    try {
      iconElement.src = await this._api.fetchCharacterIcon(
        model.charName,
        "side",
      );
    } catch {
      iconElement.style.backgroundColor = charColor;
    }
    iconElement.style.borderTop = `solid 1px ${charColor}`;
    iconElement.style.borderLeft = `solid 3px ${charColor}`;
    iconElement.style.borderBottom = `solid 1px ${charColor}`;

    const barFill = this.getElement(".pol-waifu-fill");
    barFill.style.backgroundColor = charColor;
    barFill.style.width = `${this._values.getOptionValue(model.polTitle, model.charName)}%`;

    this._polOptionInfo.textContent = `${char.name}:${model.votes.toString()}`;
  }
}
