export type ThemeMode = "dark" | "light";

export interface ThemeDef {
  id: string;
  name: string;
  mode: ThemeMode;
  /** ID tema pasangan untuk toggle dark/light (harus mode berlawanan). */
  pair?: string;
  /** Warna untuk preview swatch di UI (background, primary, accent). */
  preview: [string, string, string];
}

/** Tema tersedia. `mode` menentukan basis light/dark (color-scheme + syntax highlight). */
export const THEMES: ThemeDef[] = [
  { id: "catppuccin-mocha", name: "Catppuccin Mocha", mode: "dark", pair: "catppuccin-latte", preview: ["#1e1e2e", "#cba6f7", "#89b4fa"] },
  { id: "catppuccin-latte", name: "Catppuccin Latte", mode: "light", pair: "catppuccin-mocha", preview: ["#eff1f5", "#8839ef", "#1e66f5"] },
  { id: "tokyo-night", name: "Tokyo Night", mode: "dark", pair: "tokyo-day", preview: ["#1a1b26", "#7aa2f7", "#bb9af7"] },
  { id: "tokyo-day", name: "Tokyo Day", mode: "light", pair: "tokyo-night", preview: ["#e1e2e7", "#34548a", "#9854f1"] },
  { id: "dracula", name: "Dracula", mode: "dark", preview: ["#282a36", "#bd93f9", "#ff79c6"] },
  { id: "nord", name: "Nord", mode: "dark", preview: ["#2e3440", "#88c0d0", "#b48ead"] },
  { id: "gruvbox-dark", name: "Gruvbox Dark", mode: "dark", pair: "gruvbox-light", preview: ["#282828", "#fe8019", "#b8bb26"] },
  { id: "gruvbox-light", name: "Gruvbox Light", mode: "light", pair: "gruvbox-dark", preview: ["#fbf1c7", "#af3a03", "#79740e"] },
  { id: "one-dark", name: "One Dark", mode: "dark", preview: ["#282c34", "#61afef", "#c678dd"] },
  { id: "rose-pine", name: "Rose Pine", mode: "dark", preview: ["#191724", "#ebbcba", "#c4a7e7"] },
  { id: "kanagawa", name: "Kanagawa", mode: "dark", preview: ["#1f1f28", "#7e9cd8", "#957fb8"] },
  { id: "vesper", name: "Vesper", mode: "dark", preview: ["#101010", "#c9b8a0", "#8a7a66"] },
  { id: "solarized-dark", name: "Solarized Dark", mode: "dark", pair: "solarized-light", preview: ["#002b36", "#268bd2", "#d33682"] },
  { id: "solarized-light", name: "Solarized Light", mode: "light", pair: "solarized-dark", preview: ["#fdf6e3", "#268bd2", "#d33682"] },
];

export const DEFAULT_THEME_ID = "catppuccin-mocha";

export function getTheme(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
