import { component, ComponentBase } from "@/app/components";

import "./home-princess.scss";
import { inject } from "inversify";
import { PrincessService } from "@/app/services/PrincessService";
const template = `<img alt="Princess" class="home-princess" />`;

@component("home-princess", template, true)
export class HomePrincess extends ComponentBase {
  private _princessElement: HTMLImageElement;
  constructor(
    @inject(PrincessService) private readonly _princess: PrincessService,
  ) {
    super(HomePrincess);

    this._princessElement = this.getElement<HTMLImageElement>(".home-princess");
  }

  public override async initialize(): Promise<void> {
    const princessUrl = await this._princess.getPrincessImageUrl();
    this._princessElement.src = princessUrl;
  }
}
