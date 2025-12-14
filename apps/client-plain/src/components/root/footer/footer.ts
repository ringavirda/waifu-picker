import { component, ComponentBase } from "@/app/components";

import badge from "@/assets/fallen_badge.png";
import "./footer.scss";
const template = `
<div class="footer">
  <div class="motto">
    Gloria in Excelsis <span class="stella">Stella Caesa</span>!
  </div>
  <img class="badge" alt="Flare Wing" />
</div>
`;

@component("footer", template)
export class Footer extends ComponentBase {
  constructor() {
    super(Footer);
  }

  public override async initialize(): Promise<void> {
    this.getElement<HTMLImageElement>(".badge").src = badge;
  }
}
