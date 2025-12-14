import {
  component,
  ComponentBase,
  ErrorCard,
  loadComponent,
} from "@/app/components";
import { CharsCard, CharsModel } from "@/components/chars";

import "./chars-list.scss";
const template = `<div class="chars-list"></div>`;

@component("chars-list", template, true)
export class CharsList extends ComponentBase {
  private _charsList: HTMLDivElement;

  constructor() {
    super(CharsList);

    this._charsList = this.getElement(".chars-list");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: CharsModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);

    await this.loadWaifus(model.default);
  }

  public clearCharacterList(): void {
    this._charsList.innerHTML = "";
  }

  public async loadWaifus(waifus: Array<string>): Promise<void> {
    this.clearCharacterList();
    await Promise.all(
      waifus.map(async (waifu) => {
        await this.addCharacter(waifu);
      }),
    );
  }

  private async addCharacter(char: string): Promise<void> {
    try {
      await loadComponent(this._charsList, CharsCard, char);
    } catch (error: unknown) {
      await this.addError(error as Error);
    }
  }

  private async addError(error: Error): Promise<void> {
    await loadComponent(this._charsList, ErrorCard, error);
  }
}
