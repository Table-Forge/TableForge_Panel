import { useBoundStore } from "@/src/store";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const theme = useBoundStore((state) => state.theme);
  const toggleTheme = useBoundStore((state) => state.toggleTheme);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary active:scale-95 focus-visible:outline-hidden"
      title={isLight ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
      aria-label={isLight ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
    >
      {isLight ? (
        <Sun size={17} className="text-amber-500 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon size={17} className="text-white/80 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
