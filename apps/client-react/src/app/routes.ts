import { createBrowserRouter } from "react-router";
import { CharsPage, HomePage, PollsPage, RootLayout } from "@/pages";

export function useAppRouter() {
  return createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      children: [
        { index: true, Component: HomePage },
        { path: "chars", Component: CharsPage },
        { path: "polls", Component: PollsPage },
      ],
    },
  ]);
}
