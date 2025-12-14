import "reflect-metadata";

import "./styles.scss";

import { useAppServices } from "@/app";
import { loadComponent, LoadingSpinner } from "@/app/components";
import { Root } from "@/components/root";

// Configure
await useAppServices();

// Bootstrap

const rootElement = document.querySelector<HTMLElement>(".root");
if (rootElement === null)
  throw new Error(
    `Root tag wasn't found - app bounding failed. Should be: <div class="root"></div>`,
  );

await loadComponent(rootElement, LoadingSpinner);
await loadComponent(rootElement, Root, null, true);
