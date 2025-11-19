import { component, ComponentBase } from "@/components";

import badge from "@/assets/fallen_badge.png";
import "./app-footer.scss";
const template = `
<div class="footer">
  <div class="motto">
    Gloria in Excelsis <span class="stella">Stella Caesa</span>!
  </div>
  <img class="badge" alt="Flare Wing" />
</div>
`;

@component("app-footer", template)
export class AppFooter extends ComponentBase {
  constructor() {
    super(AppFooter);
  }

  public override async initialize(): Promise<void> {
    this.getElement<HTMLImageElement>(".badge").src = badge;
  }
}
