import "reflect-metadata";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import "./styles.css";
import { ServiceProvider, useAppRouter, useAppServices } from "@/app";

const router = useAppRouter();
const services = useAppServices();

const root = document.getElementById("root") ?? document.body;
createRoot(root).render(
  <ServiceProvider services={services}>
    <RouterProvider router={router} />
  </ServiceProvider>,
);
