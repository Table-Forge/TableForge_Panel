import type { SliceCreator } from "@/src/store/types";

export const THEME_STORAGE_KEY = "tableforge_panel_theme";
export type Theme = "dark" | "light";

export interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  hydrateTheme: () => void;
}

const applyThemeToDOM = (theme: Theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") {
    applyThemeToDOM(stored);
    return stored;
  }
  applyThemeToDOM("dark");
  return "dark";
};

export const createThemeSlice: SliceCreator<ThemeSlice> = (set) => {
  const initialTheme = getInitialTheme();

  return {
    theme: initialTheme,
    setTheme: (theme) => {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      applyThemeToDOM(theme);
      set({ theme });
    },
    toggleTheme: () => {
      set((state) => {
        const nextTheme: Theme = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyThemeToDOM(nextTheme);
        return { theme: nextTheme };
      });
    },
    hydrateTheme: () => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      const themeToSet: Theme = stored === "light" ? "light" : "dark";
      applyThemeToDOM(themeToSet);
      set({ theme: themeToSet });
    },
  };
};
