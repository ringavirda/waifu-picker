/* eslint-disable react-hooks/rules-of-hooks */
import "reflect-metadata";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider as StoreProvider } from "react-redux";

import "./styles.css";
import {
  ServiceProvider,
  useAppRoutes,
  useAppServices,
  useAppStore,
} from "@/app";

console.log(import.meta.env);

const store = useAppStore();
const services = useAppServices();
const router = useAppRoutes();

const root = document.getElementById("root") ?? document.body;
createRoot(root).render(
  <StoreProvider store={store}>
    <ServiceProvider services={services}>
      <RouterProvider router={router} />
    </ServiceProvider>
  </StoreProvider>,
);
