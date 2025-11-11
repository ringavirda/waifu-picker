import { container } from "tsyringe";
import { WaifuPol } from "@wp/common";

import { component, ComponentBase, loadComponent, Router } from "@/components";
import { PolsCreateOption, PolsPage } from "@/components/pols";
import { CharsGenshinApi, PolsApi } from "@/services";

import "./pols-create.scss";
import template from "./pols-create.html";

export type PolsCreateOptionModel = {
  char: string;
  removeCallback: (char: string) => Promise<void>;
};

@component("pols-create", template, true)
export class PolsCreate extends ComponentBase {
  private _newPolModel: WaifuPol = new WaifuPol();

  private _titleInputElement: HTMLInputElement;
  private _descriptionAreaElement: HTMLTextAreaElement;

  private _optionsSelectElement: HTMLSelectElement;
  private _optionsViewElement: HTMLDivElement;

  private _errorsDisplay: HTMLDivElement;

  constructor(
    private readonly _apiChars: CharsGenshinApi,
    private readonly _apiPols: PolsApi,
    private readonly _router: Router,
  ) {
    super(PolsCreate);

    this._titleInputElement = this.getElement("[id='title-input']");
    this._descriptionAreaElement = this.getElement("[id='desc-input']");

    this._optionsViewElement = this.getElement(".pols-create-options-display");
    this._optionsSelectElement = this.getElement("[id='options-select']");
    this._errorsDisplay = this.getElement(".pols-create-errors-display");
  }

  public async initialize(): Promise<void> {
    this.getElement(".pols-create-close").addEventListener(
      "click",
      (async () => await this._router.removePopover()).bind(this),
    );

    this.getElement(".pols-create-create").addEventListener(
      "click",
      (async () => {
        this._errorsDisplay.innerHTML = "";

        if (this._titleInputElement.value === "")
          this.displayError("You need to add some title!");
        else if (this._newPolModel.options.size < 2)
          this.displayError("You need to add at least two options!");
        else {
          this._newPolModel.title = this._titleInputElement.value;
          if (this._descriptionAreaElement.value !== "")
            this._newPolModel.description = this._descriptionAreaElement.value;

          const polsPage = container.resolve(PolsPage);
          if (
            polsPage.Pols.find((pol) => pol.title === this._newPolModel.title)
          )
            this.displayError(
              `Pol with title [${this._newPolModel.title}] already exists!`,
            );
          else {
            await this._apiPols.fetchCreatePol(this._newPolModel);

            polsPage.reloadPols();
            await this._router.removePopover();
          }
        }
      }).bind(this),
    );

    const waifus = await this._apiChars.fetchCharacterList();
    waifus.forEach((waifu) => {
      const option = document.createElement("option");
      option.value = waifu;
      option.textContent = waifu;
      this._optionsSelectElement.add(option);
    });

    this.getElement<HTMLButtonElement>(
      ".pols-create-options-add",
    ).addEventListener("click", async () => {
      const current = this._optionsSelectElement.value;
      if (!this._newPolModel.options.has(current)) {
        this._newPolModel.options.set(current, []);
        await this.refreshOptionsView();
      }
    });

    await this.refreshOptionsView();
  }

  private async refreshOptionsView() {
    this._optionsViewElement.innerHTML = "";

    if (this._newPolModel.options.size === 0) {
      this._optionsViewElement.innerHTML = "No options were selected yet.";
    } else {
      for (const waifu of this._newPolModel.options.keys()) {
        await loadComponent(this._optionsViewElement, PolsCreateOption, {
          char: waifu,
          removeCallback: this.removeOption.bind(this),
        } as PolsCreateOptionModel);
      }
    }
  }

  private async removeOption(char: string) {
    this._newPolModel.options.delete(char);
    await this.refreshOptionsView();
  }

  private displayError(message: string) {
    const errorElement = document.createElement("div");
    errorElement.classList.add("pols-create-error");
    errorElement.textContent = message;
    this._errorsDisplay.appendChild(errorElement);
  }
}
