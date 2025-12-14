import { Route, Router } from "@/app";

import { component, ComponentBase } from "@/app/components";
import { CharsPage } from "@/components/chars";
import { HomePage } from "@/components/home";
import { PollsPage } from "@/components/polls";
import { Footer, Header, Navbar } from ".";

import "./root.scss";
const template = `
<header></header>
<navbar></navbar>
<div class="router-outlet"></div>
<footer></footer>
`;

@component("root", template)
export class Root extends ComponentBase {
  constructor(private readonly _router: Router) {
    super(Root);
  }

  public async initialize(): Promise<void> {
    await this.loadComponent(Header);
    await this.loadComponent(Navbar);
    await this.loadComponent(Footer);

    const appRoutes: Array<Route> = [
      { path: "/", component: HomePage },
      { path: "/chars", component: CharsPage },
      { path: "/polls", component: PollsPage },
    ];

    const routerElement = this.getElement(".router-outlet");
    this._router.registerAnchor(routerElement, appRoutes);
    const path = window.location.pathname;
    await this._router.changeLocation(path);
  }
}
