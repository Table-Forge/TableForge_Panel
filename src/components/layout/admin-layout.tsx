import { LayoutGrid, LogOut, ScrollText, ShieldUser } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BrandName } from "@/src/components/ui/brand-name";
import { Button } from "@/src/components/button/button";
import { useAuth } from "@/src/context/auth";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/campaigns", label: "Campanhas", icon: ScrollText },
  { to: "/users", label: "Usuários", icon: ShieldUser },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto grid min-h-screen w-full grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-primary/85 p-5 lg:border-b-0 lg:border-r">
          <div className="rounded-2xl border border-secondary/30 bg-primary/90 px-4 py-5">
            <BrandName sizeClassName="text-2xl" className="text-center" />
            <p className="mt-2 text-center text-xs text-grays-100">
              Painel administrativo do TableForge
            </p>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition",
                    isActive
                      ? "border-tertiary bg-tertiary/15 text-white shadow-[0_0_0_1px_rgba(251,69,1,0.28)]"
                      : "border-secondary/20 bg-secondary/10 text-grays-100 hover:border-secondary/40 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between border-b border-white/10 bg-primary/45 px-5 py-4 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-grays-100">
                Sessão ativa
              </p>
              <p className="text-sm font-semibold text-white">
                {user?.nickname ?? user?.username ?? "Aventureiro"}
              </p>
            </div>

            <Button buttonStyle="secondary" className="!h-10 !px-3 !py-2" onClick={handleSignOut}>
              <LogOut size={16} />
              Sair
            </Button>
          </header>

          <section className="flex-1 p-5 lg:p-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
