import { WaifuPoll } from "@wp/common";
import {
  component,
  ComponentBase,
  ErrorCard,
  loadComponent,
} from "@/app/components";
import { PollsApi } from "@/app/api";
import { PollValues } from "@/app/services";
import { PollsWaifu } from "@/components/polls";

import "./polls.scss";
const template = `<div class='polls-wrapper'></div>`;

@component("polls-page", template)
export class PollsPage extends ComponentBase {
  private _pollsWrapperElement: HTMLDivElement;

  constructor(
    private readonly _api: PollsApi,
    private readonly _values: PollValues,
  ) {
    super(PollsPage);

    this._pollsWrapperElement = this.getElement(".polls-wrapper");
  }

  public accessor Polls: Array<WaifuPoll> = null!;

  public override async initialize(): Promise<void> {
    await this.reloadPolls();

    if (this._element.childNodes.length === 0)
      this._element.appendChild(this._pollsWrapperElement);
  }

  public async reloadPolls(): Promise<void> {
    try {
      this.Polls = await this._api.fetchAllPolls();
      await this._values.registerPolls(this.Polls);
    } catch (error: unknown) {
      this._pollsWrapperElement.innerHTML = "";
      await loadComponent(this._pollsWrapperElement, ErrorCard, error as Error);
      return;
    }

    this._pollsWrapperElement.innerHTML = "";
    if (this.Polls.length === 0) {
      this._pollsWrapperElement.classList.add("no-polls");
      this._pollsWrapperElement.textContent = "There aren't any polls yet!";
    } else {
      for (const poll of this.Polls) {
        await loadComponent(this._pollsWrapperElement, PollsWaifu, poll);
      }

      // this.Polls.forEach((poll) => this._values.emit("update", poll));
    }
  }
}
