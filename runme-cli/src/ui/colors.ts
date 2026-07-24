import chalk from "chalk";
import { ThemeColors } from "../types/index.js";

export function createThemeColors(theme: ThemeColors) {
  return {
    bg: chalk.bgHex(theme.background),
    fg: chalk.hex(theme.foreground),
    accent: chalk.hex(theme.accent),
    secondary: chalk.hex(theme.secondary),
    success: chalk.hex(theme.success),
    error: chalk.hex(theme.error),
    warning: chalk.hex(theme.warning),
    muted: chalk.hex(theme.muted),
    bold: chalk.bold.hex(theme.foreground),
    dim: chalk.dim.hex(theme.muted),
    underline: chalk.underline.hex(theme.accent),
  };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function gradientText(
  text: string,
  fromHex: string,
  toHex: string
): string {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  const chars = text.split("");
  return chars
    .map((ch, i) => {
      if (ch === " ") return ch;
      const t = chars.length > 1 ? i / (chars.length - 1) : 0;
      const r = Math.round(from.r + (to.r - from.r) * t);
      const g = Math.round(from.g + (to.g - from.g) * t);
      const b = Math.round(from.b + (to.b - from.b) * t);
      return chalk.rgb(r, g, b)(ch);
    })
    .join("");
}
