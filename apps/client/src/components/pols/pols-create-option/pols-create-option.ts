import { VisionColors } from "@wp/common";

import { component, ComponentBase } from "@/components";
import { PolsCreateOptionModel } from "@/components/pols";
import { CharsApi } from "@/services";

import "./pols-create-option.scss";
const template = `
<div class="pols-create-waifu-option">
  <div class="pols-create-waifu-bar"></div>
  <div class="pols-create-waifu-name"></div>
  <img alt="" class="pols-create-waifu-icon" />
  <div class="pols-create-waifu-remove">Remove</div>
</div>
`;

@component("pols-create-option", template, true)
export class PolsCreateOption extends ComponentBase {
  constructor(private readonly _apiChars: CharsApi) {
    super(PolsCreateOption);
  }

  public async initialize(
    anchor?: HTMLElement,
    model?: PolsCreateOptionModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);
    const char = await this._apiChars.fetchCharacter(model.char);
    let charColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (charColor == null) {
      charColor = VisionColors.default;
    }

    this.getElement(".pols-create-waifu-remove").addEventListener("click", () =>
      model.removeCallback(model.char),
    );
    const iconElement = this.getElement<HTMLImageElement>(
      ".pols-create-waifu-icon",
    );
    try {
      iconElement.src = await this._apiChars.fetchCharacterIcon(
        model.char,
        "side",
      );
    } catch {
      iconElement.style.backgroundColor = charColor;
    }

    iconElement.style.borderTop = `solid 1px ${charColor}`;
    iconElement.style.borderLeft = `solid 3px ${charColor}`;
    iconElement.style.borderBottom = `solid 1px ${charColor}`;

    this.getElement(".pols-create-waifu-name").textContent = char.name;

    this.getElement(".pols-create-waifu-bar").style.backgroundColor = charColor;
  }
}
