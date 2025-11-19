import { Route, Routes } from "react-router";

import "./app.scss";

import { CharsPage, HomePage, PolsPage } from "@/pages";
import { AppFooter, AppHeader, AppNavbar } from "@/app";

export function App() {
  return (
    <div className="app-root">
      <AppHeader />
      <AppNavbar />
      <div className="app-router">
        <Routes>
          <Route index element={HomePage()} />
          <Route path="/chars" element={CharsPage()} />
          <Route path="/pols" element={PolsPage()} />
        </Routes>
      </div>
      <AppFooter />
    </div>
  );
}
