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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "@/src/context/use-auth";
import { useBoundStore } from "@/src/store";

interface INavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  end?: boolean;
}

const navItems: INavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
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
  const isSidebarCollapsed = useBoundStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useBoundStore((state) => state.toggleSidebar);
  const { user } = useAuth();

  const isOrganizer = user?.type === "Organizer";

  const organizerItems: INavItem[] = [
    { to: "/my-space", label: "Meu Espaço", icon: Sparkles },
    { to: "/my-bookings", label: "Agendamentos", icon: ScrollText },
  ];

  const allItems = [...navItems, ...(isOrganizer ? organizerItems : [])];

  return (
    <aside
      className={`flex flex-col rounded-3xl border border-white/10 bg-primary/60 p-3.5 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out lg:h-full lg:overflow-y-auto ${
        isSidebarCollapsed ? "lg:items-center lg:px-2" : "lg:px-4"
      }`}
    >
      {/* Mobile Topbar */}
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

      {/* Desktop Header & Toggle Button */}
      <div className="hidden lg:flex lg:w-full lg:items-center lg:justify-between lg:mb-2">
        {!isSidebarCollapsed && (
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-grays-200 pl-1">
            Navegação
          </span>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className={`flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white ${
            isSidebarCollapsed ? "mx-auto" : ""
          }`}
          title={isSidebarCollapsed ? "Expandir menu lateral" : "Minimizar menu lateral"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </button>
      </div>

      {/* Brand Header */}
      <div
        className={`${
          isMobileOpen ? "mt-3 block" : "hidden"
        } rounded-2xl border border-white/10 bg-background/50 p-3.5 text-center lg:mt-0 lg:block transition-all duration-300`}
      >
        {isSidebarCollapsed ? (
          <img
            src="https://tableforge-bucket.s3.amazonaws.com/development/public/images/d4037d09-0893-4098-bc52-f94291c91c00.png"
            alt="TableForge Logo Simplificada"
            width={38}
            height={38}
            className="mx-auto h-9 w-9 object-contain"
            title="TableForge"
          />
        ) : (
          <>
            <img
              src="https://tableforge-bucket.s3.amazonaws.com/development/public/images/394a0616-6467-4be9-b6ad-6df1a5a57cc9.webp?v=1"
              alt="TableForge Logo"
              width={160}
              height={160}
              className="mx-auto object-contain"
            />
            <p className="mt-1 text-[11px] font-medium text-grays-200">
              Painel Administrativo
            </p>
          </>
        )}
      </div>

      {/* Navigation Items */}
      <nav
        className={`${
          isMobileOpen ? "mt-3 flex" : "hidden"
        } flex-col gap-1.5 lg:mt-4 lg:flex`}
      >
        {allItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={isSidebarCollapsed ? label : undefined}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center transition-all duration-200",
                isSidebarCollapsed
                  ? "h-11 w-11 justify-center rounded-2xl border mx-auto"
                  : "gap-3 rounded-2xl border px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider",
                isActive
                  ? "border-secondary/60 bg-gradient-to-r from-secondary/25 via-secondary/15 to-transparent text-white shadow-[0_4px_20px_rgba(255,36,0,0.18)]"
                  : "border-transparent text-grays-100 hover:border-white/10 hover:bg-white/5 hover:text-white",
              ].join(" ")
            }
          >
            <div
              className={`flex items-center justify-center rounded-xl ${
                isSidebarCollapsed
                  ? "h-full w-full"
                  : "h-7 w-7 bg-white/5 group-hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
            </div>
            {!isSidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
