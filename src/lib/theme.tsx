"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark",
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

function readStoredTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;
  try {
    return (localStorage.getItem("theme") as Theme) || defaultTheme;
  } catch {
    return defaultTheme;
  }
}

function applyTheme(theme: Theme, animate = false) {
  const root = document.documentElement;
  if (animate) root.classList.add("theme-transitioning");
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  }
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  if (animate) setTimeout(() => root.classList.remove("theme-transitioning"), 300);
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(() =>
    readStoredTheme(defaultTheme)
  );

  const setTheme = useCallback(
    (next: Theme) => {
      applyTheme(next, true);
      setThemeState(next);
    },
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
