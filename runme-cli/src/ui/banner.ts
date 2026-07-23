import figlet from "figlet";
import { ThemeColors } from "../types/index.js";
import { createThemeColors } from "./colors.js";

const DEFAULT_BANNER = figlet.textSync("Run Me", {
  font: "ANSI Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true,
});

export function renderBanner(customText?: string, theme?: ThemeColors): string {
  const colors = theme ? createThemeColors(theme) : null;
  const banner = customText
    ? figlet.textSync(customText, {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    : DEFAULT_BANNER;

  if (colors) {
    return colors.accent(banner);
  }
  return banner;
}

export function renderSmallBanner(theme?: ThemeColors): string {
  const colors = theme ? createThemeColors(theme) : null;
  const banner = "▶ RUNME";

  if (colors) {
    return colors.accent(banner);
  }
  return banner;
}
