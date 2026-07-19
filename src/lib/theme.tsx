"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_THEME_ID, getTheme, THEMES } from "@/lib/themes";

type ThemeId = string;
type ThemeMode = "dark" | "light";

interface ThemeContextValue {
  /** ID tema aktif, mis. "catppuccin-mocha". */
  theme: ThemeId;
  /** "dark" | "light" — basis tema aktif. */
  mode: ThemeMode;
  setTheme: (id: ThemeId) => void;
  /** Toggle hanya basis dark/light, pertahankan palet tema terdekat. */
  toggleMode: () => void;
  themes: typeof THEMES;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME_ID,
  mode: "dark",
  setTheme: () => {},
  toggleMode: () => {},
  themes: THEMES,
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  try {
    const id = localStorage.getItem("theme");
    return getTheme(id ?? "").id;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

function applyTheme(id: ThemeId) {
  const def = getTheme(id);
  const root = document.documentElement;
  root.setAttribute("data-theme", def.id);
  root.classList.toggle("dark", def.mode === "dark");
  root.classList.toggle("light", def.mode === "light");
  root.style.colorScheme = def.mode;
  try {
    localStorage.setItem("theme", def.id);
  } catch {}
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeId>(() => readStoredTheme());

  // Sync DOM + localStorage on mount so React state, DOM attr, and
  // colorScheme are all consistent regardless of SSR/hydration order.
  useEffect(() => { applyTheme(theme); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setTheme = useCallback((id: ThemeId) => {
    applyTheme(id);
    setThemeState(id);
  }, []);

  const toggleMode = useCallback(() => {
    setThemeState((curr) => {
      const currMode = getTheme(curr).mode;
      const want: ThemeMode = currMode === "dark" ? "light" : "dark";
      // Cari tema dengan mode berlawanan yang paletnya mirip (sama prefix).
      const base = curr.replace(/-(dark|light|mocha|latte|night|day)$/i, "");
      const alt =
        THEMES.find((t) => t.id !== curr && t.mode === want && t.id.startsWith(base)) ??
        THEMES.find((t) => t.mode === want) ??
        THEMES[0];
      applyTheme(alt.id);
      return alt.id;
    });
  }, []);

  const def = getTheme(theme);

  return (
    <ThemeContext.Provider
      value={{ theme, mode: def.mode, setTheme, toggleMode, themes: THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
