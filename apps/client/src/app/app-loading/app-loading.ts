import { component, ComponentBase } from "@/components";

import "./app-loading.scss";
const template = `<div class="loading"></div>`;

@component("app-loading", template)
export class AppLoadingSpinner extends ComponentBase {
  constructor() {
    super(AppLoadingSpinner);
  }

  public override async initialize(): Promise<void> {}
}
