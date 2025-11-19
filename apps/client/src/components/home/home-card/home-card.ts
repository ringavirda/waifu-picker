import { component, ComponentBase } from "@/components";

import "./home-card.scss";
const template = `
<div class="home-card">
  <div class="slogan">Select your <span>Waifu</span> with style!</div>
  <div class="features">
    Currently available features are:
    <ul>
      <li>Character catalogue</li>
      <li>Top Waifu polling</li>
    </ul>
  </div>
</div>
`;

@component("home-card", template, true)
export class HomeCard extends ComponentBase {
  constructor() {
    super(HomeCard);
  }

  public override async initialize(): Promise<void> {}
}
