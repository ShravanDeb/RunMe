import chalk from "chalk";
import { ThemeColors } from "../types/index.js";
import { createThemeColors, hexToRgb } from "./colors.js";

const W = 46;
const BORDER_W = W - 2;

const ch = {
  tl: "\u256D",
  tr: "\u256E",
  bl: "\u2570",
  br: "\u256F",
  h: "\u2500",
  v: "\u2502",
  tlI: "\u256D",
  trI: "\u250E",
  blI: "\u2570",
  brI: "\u2518",
};

export function drawSectionHeader(title: string, theme: ThemeColors): string {
  const c = createThemeColors(theme);
  const label = ` ${title} `;
  const remaining = BORDER_W - label.length;
  const left = Math.floor(remaining / 2);
  const right = remaining - left;
  return (
    `  ${c.accent(ch.tlI)}` +
    c.accent(ch.h.repeat(left)) +
    c.bold(label) +
    c.accent(ch.h.repeat(right)) +
    c.accent(ch.trI)
  );
}

export function drawSectionFooter(theme: ThemeColors): string {
  const c = createThemeColors(theme);
  return `  ${c.accent(ch.blI)}${c.accent(ch.h.repeat(BORDER_W))}${c.accent(ch.brI)}`;
}

export function drawEmptyLine(theme: ThemeColors): string {
  const c = createThemeColors(theme);
  return `  ${c.accent(ch.v)}${" ".repeat(BORDER_W)}${c.accent(ch.v)}`;
}

export function drawContentLine(text: string, theme: ThemeColors): string {
  const c = createThemeColors(theme);
  const stripped = stripAnsi(text);
  const pad = Math.max(0, BORDER_W - 2 - stripped.length);
  return `  ${c.accent(ch.v)} ${text}${" ".repeat(pad)} ${c.accent(ch.v)}`;
}

export function drawSeparator(theme: ThemeColors): string {
  const c = createThemeColors(theme);
  return `  ${c.accent(ch.v)} ${c.muted(ch.h.repeat(BORDER_W - 2))} ${c.accent(ch.v)}`;
}

export function drawProgressBar(
  value: number,
  max: number,
  theme: ThemeColors,
  width: number = 16
): string {
  const c = createThemeColors(theme);
  const filled = Math.round((value / max) * width);
  const empty = width - filled;
  const pct = Math.round((value / max) * 100);
  const accentRgb = hexToRgb(theme.accent);
  const secondaryRgb = hexToRgb(theme.secondary);
  let bar = "";
  for (let i = 0; i < width; i++) {
    if (i < filled) {
      const t = filled > 1 ? i / (filled - 1) : 0;
      const r = Math.round(accentRgb.r + (secondaryRgb.r - accentRgb.r) * t);
      const g = Math.round(accentRgb.g + (secondaryRgb.g - accentRgb.g) * t);
      const b = Math.round(accentRgb.b + (secondaryRgb.b - accentRgb.b) * t);
      bar += chalk.rgb(r, g, b)("\u2588");
    } else {
      bar += c.muted("\u2591");
    }
  }
  return `${bar} ${c.dim(pct + "%")}`;
}

export function drawSkillBar(level: string, theme: ThemeColors): string {
  const levels: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };
  const filled = levels[level] || 0;
  const c = createThemeColors(theme);
  const accentRgb = hexToRgb(theme.accent);
  const secondaryRgb = hexToRgb(theme.secondary);
  let bar = "";
  for (let i = 0; i < 4; i++) {
    if (i < filled) {
      const t = filled > 1 ? i / (filled - 1) : 0;
      const r = Math.round(accentRgb.r + (secondaryRgb.r - accentRgb.r) * t);
      const g = Math.round(accentRgb.g + (secondaryRgb.g - accentRgb.g) * t);
      const b = Math.round(accentRgb.b + (secondaryRgb.b - accentRgb.b) * t);
      bar += chalk.rgb(r, g, b)("\u2588");
    } else {
      bar += c.muted("\u2591");
    }
  }
  return `${bar} ${c.dim(level)}`;
}

export function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\u001B\u009B][[\]()#;?]*(?:(?:;(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy>~]))/g, "");
}
