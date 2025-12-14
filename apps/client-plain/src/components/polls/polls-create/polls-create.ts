import { WaifuPoll } from "@wp/common";

import { PollsCreateOption, PollsPage } from "@/components/polls";

import "./polls-create.scss";
import template from "./polls-create.html";
import { component, ComponentBase, loadComponent } from "@/app/components";
import { container, Router, TYPES } from "@/app";
import { ICharactersApi, PollsApi } from "@/app/api";
import { inject } from "inversify";

export type PollsCreateOptionModel = {
  char: string;
  removeCallback: (char: string) => Promise<void>;
};

@component("polls-create", template, true)
export class PollsCreate extends ComponentBase {
  private _newPollModel: WaifuPoll = new WaifuPoll();

  private _titleInputElement: HTMLInputElement;
  private _descriptionAreaElement: HTMLTextAreaElement;

  private _optionsSelectElement: HTMLSelectElement;
  private _optionsViewElement: HTMLDivElement;

  private _errorsDisplay: HTMLDivElement;

  constructor(
    @inject(TYPES.ICharactersApi) private readonly _characters: ICharactersApi,
    private readonly _pollsApi: PollsApi,
    private readonly _router: Router,
  ) {
    super(PollsCreate);

    this._titleInputElement = this.getElement("[id='title-input']");
    this._descriptionAreaElement = this.getElement("[id='desc-input']");

    this._optionsViewElement = this.getElement(".polls-create-options-display");
    this._optionsSelectElement = this.getElement("[id='options-select']");
    this._errorsDisplay = this.getElement(".polls-create-errors-display");
  }

  public async initialize(): Promise<void> {
    this.getElement(".polls-create-close").addEventListener(
      "click",
      (async () => await this._router.removePopover()).bind(this),
    );

    this.getElement(".polls-create-create").addEventListener(
      "click",
      (async () => {
        this._errorsDisplay.innerHTML = "";

        if (this._titleInputElement.value === "")
          this.displayError("You need to add some title!");
        else if (this._newPollModel.options.size < 2)
          this.displayError("You need to add at least two options!");
        else {
          this._newPollModel.title = this._titleInputElement.value;
          if (this._descriptionAreaElement.value !== "")
            this._newPollModel.description = this._descriptionAreaElement.value;

          const pollsPage = container.get<PollsPage>(PollsPage);
          if (
            pollsPage.Polls.find(
              (poll) => poll.title === this._newPollModel.title,
            )
          )
            this.displayError(
              `Poll with title [${this._newPollModel.title}] already exists!`,
            );
          else {
            await this._pollsApi.fetchCreatePoll(this._newPollModel);

            pollsPage.reloadPolls();
            await this._router.removePopover();
          }
        }
      }).bind(this),
    );

    const waifus = await this._characters.fetchCharacterList();
    waifus.forEach((waifu) => {
      const option = document.createElement("option");
      option.value = waifu;
      option.textContent = waifu;
      this._optionsSelectElement.add(option);
    });

    this.getElement<HTMLButtonElement>(
      ".polls-create-options-add",
    ).addEventListener("click", async () => {
      const current = this._optionsSelectElement.value;
      if (!this._newPollModel.options.has(current)) {
        this._newPollModel.options.set(current, []);
        await this.refreshOptionsView();
      }
    });

    await this.refreshOptionsView();
  }

  private async refreshOptionsView() {
    this._optionsViewElement.innerHTML = "";

    if (this._newPollModel.options.size === 0) {
      this._optionsViewElement.innerHTML = "No options were selected yet.";
    } else {
      for (const waifu of this._newPollModel.options.keys()) {
        await loadComponent(this._optionsViewElement, PollsCreateOption, {
          char: waifu,
          removeCallback: this.removeOption.bind(this),
        } as PollsCreateOptionModel);
      }
    }
  }

  private async removeOption(char: string) {
    this._newPollModel.options.delete(char);
    await this.refreshOptionsView();
  }

  private displayError(message: string) {
    const errorElement = document.createElement("div");
    errorElement.classList.add("polls-create-error");
    errorElement.textContent = message;
    this._errorsDisplay.appendChild(errorElement);
  }
}
