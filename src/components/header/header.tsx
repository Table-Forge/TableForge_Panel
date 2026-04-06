import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";

interface HeaderNavItem {
  to: string;
  label: string;
}

interface HeaderProps {
  logoSrc?: string;
  appName?: string;
  navItems?: HeaderNavItem[];
  userName?: string;
  userCpf?: string;
  profilePath?: string;
  onLogout?: () => void;
}

export const Header = ({
  logoSrc,
  appName = "TableForge",
  navItems = [],
  userName = "Usuário",
  userCpf,
  profilePath = "/minha-conta",
  onLogout,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-primary/85 px-4 backdrop-blur md:h-20 md:px-8">
      <div className="flex items-center gap-3 md:gap-6">
        <button
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to={navItems[0]?.to ?? "/"} className="flex items-center gap-2">
          {logoSrc ? <img src={logoSrc} alt={appName} className="h-8 w-auto md:h-10" /> : null}
          <span className="text-sm font-black uppercase tracking-wide text-white md:text-base">{appName}</span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} active={isActive(item.to)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden items-end sm:flex sm:flex-col">
          <span className="text-[12px] font-bold uppercase tracking-wide text-white">{userName}</span>
          {userCpf ? <span className="text-[10px] text-grays-100">CPF: {userCpf}</span> : null}
        </div>

        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-secondary/40 bg-secondary/10 text-white transition hover:bg-secondary/20"
          onClick={() => navigate(profilePath)}
          aria-label="Minha conta"
        >
          <User size={18} />
        </button>

        <button
          onClick={handleLogout}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-grays-100 transition hover:bg-danger/20 hover:text-danger"
          aria-label="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>

      {isMenuOpen ? (
        <div className="absolute left-0 top-full w-full border-b border-white/10 bg-primary lg:hidden">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <MobileNavLink
                key={item.to}
                to={item.to}
                active={isActive(item.to)}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </MobileNavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
};

const NavLink = ({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition ${
      active ? "bg-secondary text-white" : "text-grays-100 hover:bg-white/10 hover:text-white"
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  to,
  active,
  children,
  onClick,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition ${
      active ? "bg-secondary/20 text-white" : "text-grays-100 hover:bg-white/10"
    }`}
  >
    {children}
  </Link>
);
