import { component, ComponentBase } from "@/components";

import "./chars-error.scss";
const template = `
<div class="error">
  <div class="error-title">Something went horribly wrong!</div>
  <div class="error-message"></div>
</div>
`;

@component("chars-error", template, true)
export class CharsError extends ComponentBase {
  constructor() {
    super(CharsError);
  }

  public override async initialize(
    anchor?: HTMLDivElement,
    model?: Error,
  ): Promise<void> {
    model = this.modelIsDefined(model);

    this.getElement(".error-message").textContent = model.message;
  }
}
