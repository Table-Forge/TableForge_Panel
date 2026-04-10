import { Outlet } from "react-router-dom";
import { Header } from "../header/header";
import { NavMenu } from "../nav-menu/nav-menu";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto grid min-h-screen w-full grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <NavMenu />

        <main className="flex min-w-0 flex-col">
          <Header />

          <section className="flex-1 p-5 lg:p-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
