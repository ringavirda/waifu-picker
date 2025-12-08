import { Outlet } from "react-router";

import { Footer, Navbar } from "@/components/root";

export function RootLayout() {
  return (
    <>
      <div className="from-secondary/50 flex min-h-screen flex-col bg-linear-to-br to-gray-200 text-white">
        <Navbar />
        <main className="grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
