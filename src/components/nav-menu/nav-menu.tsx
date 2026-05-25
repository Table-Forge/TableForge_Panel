import { BrandName } from "@/src/components/ui/brand-name";
import {
  FileText,
  Gamepad2,
  Image,
  LayoutGrid,
  ScrollText,
  ShieldUser,
  Sparkles,
  Swords,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Painel", icon: LayoutGrid, end: true },
  { to: "/campaigns", label: "Campanhas", icon: ScrollText },
  { to: "/gamesystems", label: "Sistemas", icon: Gamepad2 },
  { to: "/classes", label: "Classes", icon: Swords },
  { to: "/races", label: "Raças", icon: Sparkles },
  { to: "/users", label: "Usuários", icon: ShieldUser },
  { to: "/images", label: "Imagens", icon: Image },
  { to: "/logs", label: "Logs", icon: FileText },
];

export function NavMenu() {
  return (
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
  );
}
