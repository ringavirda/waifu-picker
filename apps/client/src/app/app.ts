import { container } from "tsyringe";
import { StaticConfig } from "@wp/common";

import { component, ComponentBase, Route, Router } from "@/components";
import { CharsPage } from "@/components/chars";
import { HomePage } from "@/components/home";
import { PolsPage } from "@/components/pols";
import { CharsApi, ICharsApi } from "@/services";
import { AppFooter, AppHeader, AppNavbar } from "@/app";

import "./app.scss";
const template = `
<app-header></app-header>
<app-navbar></app-navbar>
<page-router></page-router>
<app-footer></app-footer>
`;

const pageRouter = "page-router";

@component(StaticConfig.clientRootSelector, template)
export class App extends ComponentBase {
  constructor(private readonly _appRouter: Router) {
    super(App);

    container.register<ICharsApi>("ICharsApi", CharsApi);
  }

  public async initialize(): Promise<void> {
    await this.loadComponent(AppHeader);
    await this.loadComponent(AppNavbar);
    await this.loadComponent(AppFooter);

    const appRoutes: Array<Route> = StaticConfig.clientRoutes
      .map((r) => {
        if (r === "/") return { path: r, component: HomePage };
        if (r === "/chars") return { path: r, component: CharsPage };
        if (r === "/pols") return { path: r, component: PolsPage };
      })
      .filter((r) => r !== undefined);

    const routerElement = this.getElement(pageRouter);
    this._appRouter.registerAnchor(routerElement, appRoutes);

    const path = window.location.pathname;
    await this._appRouter.changeLocation(path);
  }
}
