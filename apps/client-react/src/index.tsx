import "reflect-metadata";
import { Container } from "inversify";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./styles.scss";

import { App } from "@/app";
import { CharsExternalService, ServiceProvider } from "@/services";

const container = new Container();

container.bind("ICharsService").to(CharsExternalService).inSingletonScope();

const rootElement = document.getElementById("app-root") ?? document.body;
createRoot(rootElement).render(
  <ServiceProvider container={container}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ServiceProvider>,
);
