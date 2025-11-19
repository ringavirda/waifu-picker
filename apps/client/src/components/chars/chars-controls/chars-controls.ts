import { inject } from "tsyringe";

import { component, ComponentBase } from "@/components";
import { CharsModel } from "@/components/chars";
import { ICharsApi } from "@/services";

import "./chars-controls.scss";
import template from "./chars-controls.html";

@component("chars-controls", template, true)
export class CharsControls extends ComponentBase {
  private _ctrlInput: HTMLInputElement;
  private _ctrlBtnGet: HTMLButtonElement;
  private _ctrlBtnRandom: HTMLButtonElement;

  constructor(@inject("ICharsApi") private readonly _api: ICharsApi) {
    super(CharsControls);

    this._ctrlInput = this.getElement(".ctrl-input");
    this._ctrlBtnGet = this.getElement(".ctrl-btn-get");
    this._ctrlBtnRandom = this.getElement(".ctrl-btn-rnd");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: CharsModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);
    const load = model.loadCallback;
    if (load === undefined) throw new Error("Load callback wasn't provided");

    this._ctrlBtnGet.addEventListener("click", async () => {
      const waifus = this.parseInput(this._ctrlInput.value);
      if (waifus.length === 0) await load(model.default);
      else await load(waifus);
    });

    this._ctrlBtnRandom.addEventListener("click", async () => {
      const waifuList = await this._api.fetchCharacterList();
      const waifuPos: Array<number> = [];
      while (waifuPos.length < 10) {
        const next = Math.floor(Math.random() * waifuList.length);
        if (waifuPos.indexOf(next) === -1) waifuPos.push(next);
      }
      const waifus = waifuPos.map((pos) => waifuList[pos]);
      this._ctrlInput.value = "";
      if (this._ctrlInput !== null) {
        this._ctrlInput.placeholder = waifus.join(", ");
      }
      await load(waifus);
    });

    const defaultPlaceholder = model.default.join(", ");
    if (defaultPlaceholder !== undefined)
      this._ctrlInput.placeholder = defaultPlaceholder;
  }

  private parseInput(raw: string | null | undefined): Array<string> {
    if (raw == "" || raw == undefined) return [];
    const rawUnfiltered = raw
      .split(",")
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w != "");
    return rawUnfiltered.filter(
      (waifu, index) => rawUnfiltered.indexOf(waifu) === index,
    );
  }
}
