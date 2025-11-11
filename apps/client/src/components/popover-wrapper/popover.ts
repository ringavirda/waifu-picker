import { component, ComponentBase, loadComponent } from "@/components";

import "./popover.scss";
const template = `
<popover class="popover">
  <div class="popover-component"></div>
</popover>
`;

@component("popover", template, true)
export class PopoverWrapper extends ComponentBase {
  constructor() {
    super(PopoverWrapper);
  }

  public async initialize(anchor?: HTMLElement, model?: any): Promise<void> {
    const type = this.modelIsDefined(model);
    const renderer = this.getElement(".popover-component");
    await loadComponent(renderer, type);
  }
}
