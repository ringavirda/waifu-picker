import { Route, Routes } from "react-router";

import { CharsPage, HomePage, PolsPage } from "@/pages";
import { AppFooter, AppHeader, AppNavbar } from "@/app";

export function App() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader />
      <AppNavbar />
      <div
        style={{
          flexGrow: "1",
        }}
      >
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/chars" element={<CharsPage />} />
          <Route path="/pols" element={<PolsPage />} />
        </Routes>
      </div>
      <AppFooter />
    </div>
  );
}
