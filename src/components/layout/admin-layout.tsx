import { Outlet } from "react-router-dom";
import { Header } from "../header/header";
import { NavMenu } from "../nav-menu/nav-menu";

export function AdminLayout() {
  return (
    <div className="h-dvh overflow-hidden bg-background text-white">
      <div className="mx-auto grid h-full min-h-0 w-full grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <NavMenu />

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <Header />

          <section
            id="main-wrapper"
            className="flex gap-4 min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-5 lg:p-8"
          >
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
