import { createBrowserRouter } from "react-router";

import {
  CharsDetailsPage,
  CharsPage,
  HomePage,
  PollsCreatePage,
  PollsPage,
} from "@/pages";
import { RootLayout } from "./RootLayout";

export function useAppRoutes() {
  return createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      children: [
        { index: true, Component: HomePage },
        { path: "chars", Component: CharsPage },
        { path: "chars/:charId", Component: CharsDetailsPage },
        { path: "polls", Component: PollsPage },
        { path: "polls/create", Component: PollsCreatePage },
      ],
    },
  ]);
}
