import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Gamepad2,
  Image,
  LayoutGrid,
  ScrollText,
  ShieldUser,
  Sparkles,
  Swords,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "@/src/context/use-auth";

const navItems = [
  { to: "/", label: "Painel", icon: LayoutGrid, end: true },
  { to: "/campaigns", label: "Campanhas", icon: ScrollText },
  { to: "/events", label: "Eventos", icon: CalendarDays },
  { to: "/gamesystems", label: "Sistemas", icon: Gamepad2 },
  { to: "/banners", label: "Banners", icon: Image },
  { to: "/classes", label: "Classes", icon: Swords },
  { to: "/races", label: "Raças", icon: Sparkles },
  { to: "/users", label: "Usuários", icon: ShieldUser },
  { to: "/images", label: "Imagens", icon: Image },
  { to: "/logs", label: "Logs", icon: FileText },
];

export function NavMenu() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  const isOrganizer = user?.type === "Organizer";
  
  const filteredNavItems = navItems.filter(() => {
    // If we want to hide some admin routes from Organizer, we could do it here
    // But for now, we just add the space routes
    return true;
  });

  const organizerItems = [
    { to: "/my-space", label: "Meu Espaço", icon: Sparkles },
    { to: "/my-bookings", label: "Agendamentos", icon: ScrollText },
  ];

  return (
    <aside className="flex flex-col rounded-3xl border border-white/10 bg-primary/60 p-4 backdrop-blur-md shadow-xl lg:h-full lg:overflow-y-auto">
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <img
          src="https://tableforge-bucket.s3.amazonaws.com/development/public/images/0b85dfdf-3c07-4aad-b8fe-0c88e2bbfa3f.webp?v=1"
          alt="TableForge Logo"
          width={130}
          height={130}
          className="object-contain"
        />

        <ButtonIcon
          aria-expanded={isMobileOpen}
          aria-label={isMobileOpen ? "Recolher menu" : "Expandir menu"}
          onClick={() => setIsMobileOpen((current) => !current)}
          hasHoverEffect
          isHighlighted
          size="40px"
          className="border border-secondary/30 text-white hover:border-secondary/60 !rounded-2xl"
        >
          {isMobileOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </ButtonIcon>
      </div>

      <div
        className={`${isMobileOpen ? "mt-3 block" : "hidden"} rounded-2xl border border-white/10 bg-background/50 p-4 text-center lg:mt-0 lg:block`}
      >
        <img
          src="https://tableforge-bucket.s3.amazonaws.com/development/public/images/394a0616-6467-4be9-b6ad-6df1a5a57cc9.webp?v=1"
          alt="TableForge Logo"
          width={180}
          height={180}
          className="mx-auto object-contain"
        />
        <p className="mt-1 text-[11px] font-medium text-grays-200">
          Painel Administrativo
        </p>
      </div>

      <nav
        className={`${isMobileOpen ? "mt-3 flex" : "hidden"} flex-col gap-1.5 lg:mt-5 lg:flex`}
      >
        {([...filteredNavItems, ...(isOrganizer ? organizerItems : [])] as { to: string; label: string; icon: React.ComponentType<{ size?: number }>; end?: boolean }[]).map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                isActive
                  ? "border-secondary/60 bg-gradient-to-r from-secondary/25 via-secondary/15 to-transparent text-white shadow-[0_4px_20px_rgba(255,36,0,0.18)]"
                  : "border-transparent text-grays-100 hover:border-white/10 hover:bg-white/5 hover:text-white",
              ].join(" ")
            }
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10">
              <Icon size={16} />
            </div>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
