import { component, ComponentBase } from "@/components";
import { HomeCard, HomePrincess } from "@/components/home";

const template = `
<home-card></home-card>
<home-princess></home-princess>
`;

@component("home-page", template)
export class HomePage extends ComponentBase {
  constructor() {
    super(HomePage);
  }

  public override async initialize(): Promise<void> {
    this._element.innerHTML = this._template;
    this.loadComponent(HomeCard);
    this.loadComponent(HomePrincess);
  }
}
