import { Outlet } from "react-router-dom";
import { Header } from "../header/header";
import { NavMenu } from "../nav-menu/nav-menu";
import { useBoundStore } from "@/src/store";

export function AdminLayout() {
  const isSidebarCollapsed = useBoundStore((state) => state.isSidebarCollapsed);

  return (
    <div className="h-dvh overflow-hidden bg-background text-white p-3 lg:p-4">
      <div
        className={`mx-auto grid h-full min-h-0 w-full grid-cols-1 gap-3 transition-all duration-300 ease-in-out lg:gap-4 ${
          isSidebarCollapsed
            ? "lg:grid-cols-[88px_minmax(0,1fr)]"
            : "lg:grid-cols-[280px_minmax(0,1fr)]"
        }`}
      >
        <NavMenu />

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden gap-3 lg:gap-4">
          <Header />

          <section
            id="main-wrapper"
            className="flex gap-5 min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-primary/20 p-4 lg:p-6 shadow-2xl"
          >
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
