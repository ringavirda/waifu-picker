import "reflect-metadata";
import "./styles.scss";

import { StaticConfig } from "@wp/common";
import { loadComponent } from "@/components";
import { App, AppLoadingSpinner } from "@/app";

const rootElement = document.querySelector<HTMLElement>(
  StaticConfig.clientRootSelector,
);
if (rootElement === null)
  throw new Error(
    `Root tag wasn't found - app bounding failed. Should be: ${StaticConfig.clientRootSelector}`,
  );

await loadComponent(rootElement, AppLoadingSpinner);
await loadComponent(rootElement, App, null, true);
