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
