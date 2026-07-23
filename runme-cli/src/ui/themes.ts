import { ThemeColors, ThemeName } from "../types/index.js";

export const themes: Record<ThemeName, ThemeColors> = {
  cyberpunk: {
    name: "Cyberpunk",
    background: "#0a0a0f",
    foreground: "#00ffff",
    accent: "#ff00ff",
    secondary: "#ffff00",
    success: "#00ff00",
    error: "#ff0040",
    warning: "#ffaa00",
    muted: "#666680",
  },
  dracula: {
    name: "Dracula",
    background: "#282a36",
    foreground: "#f8f8f2",
    accent: "#bd93f9",
    secondary: "#ff79c6",
    success: "#50fa7b",
    error: "#ff5555",
    warning: "#f1fa8c",
    muted: "#6272a4",
  },
  gruvbox: {
    name: "Gruvbox",
    background: "#282828",
    foreground: "#ebdbb2",
    accent: "#d65d0e",
    secondary: "#458588",
    success: "#b8bb26",
    error: "#fb4934",
    warning: "#fabd2f",
    muted: "#928374",
  },
  nord: {
    name: "Nord",
    background: "#2e3440",
    foreground: "#eceff4",
    accent: "#88c0d0",
    secondary: "#81a1c1",
    success: "#a3be8c",
    error: "#bf616a",
    warning: "#ebcb8b",
    muted: "#4c566a",
  },
  monokai: {
    name: "Monokai",
    background: "#272822",
    foreground: "#f8f8f2",
    accent: "#a6e22e",
    secondary: "#66d9ef",
    success: "#a6e22e",
    error: "#f92672",
    warning: "#e6db74",
    muted: "#75715e",
  },
  tokyonight: {
    name: "Tokyo Night",
    background: "#1a1b26",
    foreground: "#c0caf5",
    accent: "#bb9af7",
    secondary: "#7aa2f7",
    success: "#9ece6a",
    error: "#f7768e",
    warning: "#e0af68",
    muted: "#565f89",
  },
};

export function getTheme(name: ThemeName): ThemeColors {
  return themes[name] || themes.cyberpunk;
}

export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}
