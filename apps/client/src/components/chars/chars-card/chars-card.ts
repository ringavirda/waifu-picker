import { inject } from "tsyringe";
import { VisionColors } from "@wp/common";

import { component, ComponentBase } from "@/components";
import { ICharsApi } from "@/services";

import "./chars-card.scss";
import template from "./chars-card.html";

@component("chars-card", template, true)
export class CharsCard extends ComponentBase {
  private readonly _portraitResizeHeight = 540 * 2;
  private readonly _portraitResizeWidth = 340 * 2;

  constructor(@inject("ICharsApi") private _api: ICharsApi) {
    super(CharsCard);
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: string,
  ): Promise<void> {
    model = this.modelIsDefined(model);

    const char = await this._api.fetchCharacter(model);

    this.getElement(".char-name").textContent = char.name;
    this.getElement(".char-title").textContent = char.title;
    this.getElement(".char-weapon").textContent = char.weapon;
    this.getElement(".char-nation").textContent = char.nation;
    this.getElement(".char-description").textContent = char.description;

    const genderElement = this.getElement(".char-gender");
    genderElement.textContent = char.gender;
    if (char.gender === "Female") genderElement.style.backgroundColor = "pink";
    else if (char.gender == "Male")
      genderElement.style.backgroundColor = "aqua";
    else {
      genderElement.style.backgroundColor = "gold";
      genderElement.textContent = "Descender";
    }

    this.getElement(".char-rarity").textContent = String.fromCodePoint(
      0x2b50,
    ).repeat(char.rarity);

    let characterColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (characterColor == null) {
      characterColor = VisionColors.default;
    }

    const visionElement = this.getElement(".char-vision");
    visionElement.style.backgroundColor = characterColor;
    visionElement.textContent = char.vision;

    const constElement = this.getElement(".char-const");
    constElement.style.backgroundColor = characterColor;
    constElement.textContent = char.constellation;

    const portraitElement = this.getElement<HTMLImageElement>(".char-portrait");
    const borderStyle = `thick solid ${characterColor}`;
    portraitElement.src = await this._api.fetchCharacterPortrait(
      model,
      this._portraitResizeHeight,
      this._portraitResizeWidth,
    );
    portraitElement.style.borderTop = borderStyle;
    portraitElement.style.borderRight = borderStyle;
    portraitElement.style.borderBottom = borderStyle;
  }
}
