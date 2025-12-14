import { component, ComponentBase } from "../components";

import "./loading-spinner.scss";
const template = `<div class="loading-spinner"></div>`;

@component("loading-spinner", template)
export class LoadingSpinner extends ComponentBase {
  constructor() {
    super(LoadingSpinner);
  }

  public override async initialize(): Promise<void> {}
}
