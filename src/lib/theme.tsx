"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

function applyTheme(theme: Theme) {
  const root = document.documentElement;
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

  // Sync DOM + localStorage on mount so React state, DOM class, and
  // colorScheme are all consistent regardless of SSR/hydration order.
  useEffect(() => { applyTheme(theme); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setTheme = useCallback(
    (next: Theme) => {
      applyTheme(next);
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
