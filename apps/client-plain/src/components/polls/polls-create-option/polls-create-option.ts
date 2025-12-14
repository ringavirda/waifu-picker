import { inject } from "inversify";
import { VisionColors } from "@wp/common";

import { TYPES } from "@/app";
import { ICharactersApi } from "@/app/api";
import { component, ComponentBase } from "@/app/components";
import { PollsCreateOptionModel } from "@/components/polls";

import "./polls-create-option.scss";
const template = `
<div class="polls-create-waifu-option">
  <div class="polls-create-waifu-bar"></div>
  <div class="polls-create-waifu-name"></div>
  <img alt="" class="polls-create-waifu-icon" />
  <div class="polls-create-waifu-remove">Remove</div>
</div>
`;

@component("polls-create-option", template, true)
export class PollsCreateOption extends ComponentBase {
  constructor(
    @inject(TYPES.ICharactersApi) private readonly _characters: ICharactersApi,
  ) {
    super(PollsCreateOption);
  }

  public async initialize(
    anchor?: HTMLElement,
    model?: PollsCreateOptionModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);
    const char = await this._characters.fetchCharacter(model.char);
    let charColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (charColor == null) {
      charColor = VisionColors.default;
    }

    this.getElement(".polls-create-waifu-remove").addEventListener(
      "click",
      () => model.removeCallback(model.char),
    );
    const iconElement = this.getElement<HTMLImageElement>(
      ".polls-create-waifu-icon",
    );
    try {
      iconElement.src = await this._characters.fetchCharacterIcon(
        model.char,
        "side",
      );
    } catch {
      iconElement.style.backgroundColor = charColor;
    }

    iconElement.style.borderTop = `solid 1px ${charColor}`;
    iconElement.style.borderLeft = `solid 3px ${charColor}`;
    iconElement.style.borderBottom = `solid 1px ${charColor}`;

    this.getElement(".polls-create-waifu-name").textContent = char.name;
    this.getElement(".polls-create-waifu-bar").style.backgroundColor =
      charColor;
  }
}
