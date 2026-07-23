import figlet from "figlet";
import chalk from "chalk";
import { ThemeColors } from "../types/index.js";
import { createThemeColors } from "./colors.js";

const DEFAULT_BANNER = figlet.textSync("Run Me", {
  font: "ANSI Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true,
});

export function renderBanner(customText?: string, theme?: ThemeColors, gradientColor?: string): string {
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

  if (!colors) return banner;

  if (gradientColor && theme) {
    const lines = banner.split("\n");
    const accentRgb = hexToRgb(theme.accent);
    const gradRgb = hexToRgb(gradientColor);
    return lines.map((line) => {
      if (!line) return line;
      const chars = line.split("");
      return chars.map((ch, i) => {
        if (ch === " ") return ch;
        const t = chars.length > 1 ? i / (chars.length - 1) : 0;
        const r = Math.round(accentRgb.r + (gradRgb.r - accentRgb.r) * t);
        const g = Math.round(accentRgb.g + (gradRgb.g - accentRgb.g) * t);
        const b = Math.round(accentRgb.b + (gradRgb.b - accentRgb.b) * t);
        return chalk.rgb(r, g, b)(ch);
      }).join("");
    }).join("\n");
  }

  return colors.accent(banner);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

export function renderSmallBanner(theme?: ThemeColors): string {
  const colors = theme ? createThemeColors(theme) : null;
  const banner = "▶ RUNME";

  if (colors) {
    return colors.accent(banner);
  }
  return banner;
}
